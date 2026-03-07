import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import CodeEditor from "components/code-editor/code-editor";
import Preview from "components/preview/preview";
import bundle, { BundleResult, PerformanceMetrics } from "../../bundler";
import Resizable from "components/resizable/resizable";
import { updateCell } from "state/action-creators";
import { RootState } from "state/reducers";

interface CodeCellProps {
  id: string;
}

interface CumulativeStats {
  totalBundles: number;
  avgBundleTime: number;
  minBundleTime: number;
  maxBundleTime: number;
  totalBundleTime: number;
}

const globalStats: CumulativeStats = {
  totalBundles: 0,
  avgBundleTime: 0,
  minBundleTime: Infinity,
  maxBundleTime: 0,
  totalBundleTime: 0,
};

export const getGlobalStats = () => ({ ...globalStats });
export const resetGlobalStats = () => {
  globalStats.totalBundles = 0;
  globalStats.avgBundleTime = 0;
  globalStats.minBundleTime = Infinity;
  globalStats.maxBundleTime = 0;
  globalStats.totalBundleTime = 0;
};

const CodeCell: React.FC<CodeCellProps> = ({ id }) => {
  const dispatch = useDispatch();
  const cell = useSelector((state: RootState) => state.cells?.data[id]);
  const [bundledCode, setBundledCode] = useState("");
  const [err, setErr] = useState("");
  const [hasBundledInitially, setHasBundledInitially] = useState(false);
  const bundleCountRef = useRef(0);

  const content = cell?.content || "";

  useEffect(() => {
    if (!content.trim()) {
      return;
    }

    if (!hasBundledInitially) {
      const bundleImmediately = async () => {
        const bundleOutput: BundleResult & { metrics?: PerformanceMetrics } =
          await bundle(content);
        setBundledCode(bundleOutput.bundledCode);
        setErr(bundleOutput.err);
        setHasBundledInitially(true);

        if (bundleOutput.metrics) {
          bundleCountRef.current++;
          globalStats.totalBundles = bundleCountRef.current;
          globalStats.totalBundleTime += bundleOutput.metrics.bundleTime;
          globalStats.avgBundleTime =
            globalStats.totalBundleTime / globalStats.totalBundles;
          globalStats.minBundleTime = Math.min(
            globalStats.minBundleTime,
            bundleOutput.metrics.bundleTime
          );
          globalStats.maxBundleTime = Math.max(
            globalStats.maxBundleTime,
            bundleOutput.metrics.bundleTime
          );

          console.log(
            `%c📊 Cumulative Stats: ${
              globalStats.totalBundles
            } bundles | Avg: ${globalStats.avgBundleTime.toFixed(
              2
            )}ms | Min: ${globalStats.minBundleTime.toFixed(
              2
            )}ms | Max: ${globalStats.maxBundleTime.toFixed(2)}ms`,
            "color: #f59e0b; font-weight: bold;"
          );
        }
      };
      bundleImmediately();
      return;
    }

    const executionTimer = setTimeout(async () => {
      const bundleOutput: BundleResult & { metrics?: PerformanceMetrics } =
        await bundle(content);
      setBundledCode(bundleOutput.bundledCode);
      setErr(bundleOutput.err);

      if (bundleOutput.metrics) {
        bundleCountRef.current++;
        globalStats.totalBundles = bundleCountRef.current;
        globalStats.totalBundleTime += bundleOutput.metrics.bundleTime;
        globalStats.avgBundleTime =
          globalStats.totalBundleTime / globalStats.totalBundles;
        globalStats.minBundleTime = Math.min(
          globalStats.minBundleTime,
          bundleOutput.metrics.bundleTime
        );
        globalStats.maxBundleTime = Math.max(
          globalStats.maxBundleTime,
          bundleOutput.metrics.bundleTime
        );
      }
    }, 500);

    return () => {
      clearTimeout(executionTimer);
    };
  }, [content, hasBundledInitially]);

  const handleEditorChange = (value: string) => {
    dispatch(updateCell(id, value));
  };

  return (
    <Resizable direction="vertical">
      <div style={{ height: "100%", display: "flex", flexDirection: "row" }}>
        <Resizable direction="horizontal">
          <CodeEditor
            key={id}
            onChange={handleEditorChange}
            initialValue={content}
          />
        </Resizable>
        <Preview code={bundledCode} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
