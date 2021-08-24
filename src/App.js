import React, {useEffect, useState} from 'react';
import Tmdb from "./Tmdb";
import './App.css'
import MovieRow from './componets/MovieRow';
import FeaturedMovie from './componets/FeaturedMovie';
import Header from './componets/Header';



export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false)
  
  useEffect(() => {
    const loadAll = async () => {
      // Pegando a lista TOTAL
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // Pegando o Featured(filme em destaque)
      let originals = list.filter(i => i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 25) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }

    }
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    }
  }, []);


  return (
    <div className= "page">

      <Header black={blackHeader} />


      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items}/>
        ))}
      </section>

      <footer>
        Feito com <span role="img" aria-label="coração">❤️</span> por GabrielWZ<br/>
        Direitos de imagem para Netflix<br/>
        Dados pegos do site Themoviedb.org<br/>
      </footer>
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://media.wired.com/photos/592744d3f3e2356fd800bf00/master/w_2000,c_limit/Netflix_LoadTime.gif" alt="Carregando"/>
      </div>
      }
    </div>
  );
}