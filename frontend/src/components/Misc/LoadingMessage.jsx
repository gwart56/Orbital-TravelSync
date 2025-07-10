import './LoadingMessage.css';

export function LoadingMessage({loadingMessage}) {
    if (loadingMessage) {
        return <div className="loading-overlay">
                <span className="spinner-border mb-2 mx-2" role="status"></span>
                <p>{loadingMessage}</p>
              </div>
    }
}