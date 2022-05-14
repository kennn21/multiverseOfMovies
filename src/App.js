import './App.css';
import { useState, useEffect } from 'react';
import {db, storage} from './data/firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { v4 } from "uuid";
import { async } from '@firebase/util';

function App() {
  //DECLARE USESTATE VARIABLES
  const [movies, setMovies] = useState([]);
  const [newMovieName, setNewMovieName] = useState("");
  const [newMovieImageUrl, setNewMovieImageUrl] = useState("");
  const moviesCollectionRef = collection(db, "movies");

  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const imagesListRef = ref(storage, "images/");

  //UPLOAD LOGIC
  const uploadBanner = () => {
    if (imageUpload == null) return alert('Please select an image!');
    const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrls((prev) => [...prev, url]);
        setNewMovieImageUrl((prev) => [...prev, url]);
        alert('Upload Completed');
      });
    });
  };


  //CREATE LOGIC
  const createMovie = async () => {
    console.log(newMovieName);
    console.log(newMovieImageUrl);
    if (newMovieName==="" && newMovieImageUrl=== ""){
      alert("Please fill in the info!");
    } else if(newMovieName!="" && newMovieImageUrl=== ""){
      alert("Please upload the banner image!");
    } else if(newMovieName==="" && newMovieImageUrl!= ""){
      alert("Please fill in the movie name!");
    } else{
      await addDoc(moviesCollectionRef, { name: newMovieName, image: newMovieImageUrl });
      window.location.reload();
    }
  };
  
  //UPDATE LOGIC
  const [updatedMovieName, setUpdatedMovieName] = useState("");
  const updateMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    let newFields = '';
    if (updatedMovieName == '' && newMovieImageUrl == '') return;
    if (updatedMovieName != '' && newMovieImageUrl == '') {
      newFields = {name:updatedMovieName};
    } else if(updatedMovieName == '' && newMovieImageUrl != ''){
      newFields = {image:newMovieImageUrl};
    } else {
      newFields = {name:updatedMovieName, image:newMovieImageUrl};
    }
    await updateDoc(movieDoc, newFields);
    window.location.reload();
  };

  //DELETE 
  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
    window.location.reload();
  }

  //USE EFFECTS
  useEffect(() => {
    listAll(imagesListRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          setImageUrls((prev) => [...prev, url]);
        });
      });
    });
  }, []);

  useEffect(()=>{

    const getMovies = async ()=> {
      const data = await getDocs(moviesCollectionRef);
      setMovies(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
    }

    getMovies()
  }, [])
  const siteLogo = 'https://firebasestorage.googleapis.com/v0/b/multiverse-of-movies-db239.appspot.com/o/MoM.png?alt=media&token=b5476612-107b-4c28-82f2-94c225e73df7';
  return (
    <div className="App container">
      <div className="row border-bottom border-2 border-danger p-2">
        <div className="col-md-4">
          <a href="#">
            <img src={siteLogo} width='100px'/>
          </a>
        </div>
        <div className="col-md-8 align-self-center d-flex justify-content-end">
        <input placeholder="Movie Name..." onChange={(event) => {
          setNewMovieName(event.target.value);
        }}/>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <button onClick={uploadBanner}>
            Upload banner
          </button>
          <button className="ml-2" onClick={createMovie}>
            Create Movie
          </button>
        </div>
      </div>
      <div className="row justify-content-center">
            {movies.map((movie) =>{
              return (
                <>
                  <div className="card col-md-4 card m-2 p-0 bg-dark text-light text-center">
                    <img className="card-img-top " src={movie.image}/>
                    <h2 className="p-4">{movie.name}</h2>
                    <hr/>
                    <span className="mb-auto"></span>
                    <button className="btn btn-primary rounded-0" data-toggle="collapse" data-target={ `#${movie.id}` }>Update</button>
                    <div className="collapse" id={movie.id}>
                      <h5>Update Info</h5>
                      <input placeholder="Update movie name..." onChange={(event) => {
                        setUpdatedMovieName(event.target.value);
                      }}/>
                      <input
                        type="file"
                        onChange={(event) => {
                          setImageUpload(event.target.files[0]);
                        }}
                      />
                      <button onClick={uploadBanner}>Upload banner</button>
                      <button onClick={()=>{updateMovie(movie.id)}}>Update movie</button>
                    </div>
                    <button className="btn btn-danger rounded-bottom mb-3 " onClick={()=>{deleteMovie(movie.id)}}>Delete</button>
                  </div>
                </>
              )
            })}
      </div>
    </div>
  );
}

export default App;
