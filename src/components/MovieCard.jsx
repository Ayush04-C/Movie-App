import { useState } from "react";

function description(text, wordlimit){
    const words = text.split(' ');
    if(words.length <= wordlimit) return text;
    return words.slice(0, wordlimit).join(' ') + '...';
}
const MovieCard = ({movie : { id ,title, vote_average, poster_path, release_date, original_language, overview }}) => {
    const [isopen, setIsopen] = useState(false);

    const toggledescription =() => {
        setIsopen(!isopen);
    }

    return (
        <div className="desc">
            <button
              onClick={toggledescription}> 
                <div className="movie-card">
                    <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/No-Poster.png'} alt="movie-logo" />
                    <div className="mt-4">
                        <h3>{title}</h3>

                        <div className="content">
                            <div className="rating">
                                <img src="star.svg" alt="start" />
                                <p>{vote_average ? vote_average.toFixed(1): 'N/A'}</p>
                            </div>
                            <span>.</span>
                            <p className="lang">{original_language}</p>
                            <span>.</span>
                            <p className="year">{release_date ? release_date.split('-')[0]: 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </button>
            {isopen && (
                <div style=
                    {{opacity: '1',
                    transition: 'opacity 0.3s ease-in-out',
                    borderRadius: '10px',
                    border: '1px solid white',
                    color: 'white', 
                    margin: "10px 12px",
                    padding: '10px 25px',}}>
                    {description(overview, 25)}
                </div>
            )}
        </div>
    )
}

export default MovieCard;   