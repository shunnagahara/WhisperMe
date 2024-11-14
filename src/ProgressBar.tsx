
const ProgressBar = ({ progress }: { progress: number }) => {
    const getProgressColor = (progress: number) => {
        if (progress < 30) return '#e74c3c'; // 赤
        if (progress < 70) return '#f39c12'; // オレンジ
        return '#2ecc71'; // 緑
    };
    return (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{
              width: `${progress}%`,
              backgroundColor: getProgressColor(progress),
            }}
          >
            <span className="progress-text">{`${progress}%`}</span>
          </div>
        </div>
    );
}


export default ProgressBar;