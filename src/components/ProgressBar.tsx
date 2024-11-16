
const ProgressBar = ({ progress }: { progress: number }) => {
    const getProgressColor = (progress: number) => {
        if (progress < 30) return '#e74c3c';
        if (progress < 70) return '#f39c12';
        return '#2ecc71'; // 緑
    };
    return (
        <div className="progress-bar">
            <div
                className="progress-bar-fill"
                style={{
                    height: `${progress}%`,
                    backgroundColor: getProgressColor(progress),
                }}
            />
            <span className="progress-text">{`${progress}%`}</span>
        </div>
    );
}


export default ProgressBar;