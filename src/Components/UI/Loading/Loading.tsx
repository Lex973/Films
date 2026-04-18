import './Loading.css';
const Loading = () => {
    return (
        <div className='ui-loader-bg'>
            <div className="ui-loader-shell">
                <div className="ui-loader loader-blk">
                    <svg viewBox="22 22 44 44" className="multiColor-loader">
                        <circle cx="44" cy="44" r="16.2" fill="none" strokeWidth="3.6" className="loader-circle loader-circle-animation"></circle>
                    </svg>
                </div>
                <div className="ui-loader-text">
                    <span>Загружаем фильмы</span>
                    <small>Подготавливаем карточки, рейтинги и фильтры</small>
                </div>
            </div>
        </div>
    );
};

export default Loading;
