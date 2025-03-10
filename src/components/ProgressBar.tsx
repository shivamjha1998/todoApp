interface ProgressBarProps {
  completedCount: number;
  totalCount: number;
}

export default function ProgressBar({
  completedCount,
  totalCount,
}: ProgressBarProps) {
  const completedPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="progress-container">
      <div className="progress-text">Progress</div>
      <div className="progress-bar-container">
        <div
          className={`progress-bar ${
            completedPercentage === 100 ? "complete" : ""
          }`}
          style={{ width: `${completedPercentage}%` }}
        />
      </div>
      <div>{completedCount} completed</div>
    </div>
  );
}
