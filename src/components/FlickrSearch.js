import React, { Component } from 'react';
import Geocode from "react-geocode";
import GoogleMapReact from 'google-map-react';
import ReactWeather from 'react-open-weather';
import 'react-open-weather/lib/css/ReactWeather.css';
import jsonp from 'jsonp-es6';

Geocode.setApiKey("AIzaSyCwJPU1FogYVi9_urDFMPFQ0O8qFLbFZpc");

class FlickrSearch extends Component {
  constructor() {
    super();
    this.state={
      images: " ",
      center: {
        lat: 0,
        lng: 0
      },
      zoom: 11,
      city: " "
    };
    this.fetchImages = this.fetchImages.bind(this);
  }

  fetchImages(q) {
    // console.log(`search for ${q}`);
    const flickrURL = 'https://api.flickr.com/services/rest?jsoncallback=?';
    const flickrParams = {
      method: 'flickr.photos.search',
      api_key: '2f5ac274ecfac5a455f38745704ad084',
      tags: 'cityscape',
      sort: 'interestingness-desc',
      text: q,
      format: 'json'
    };

    const generateURL = function (photo) {
      return [
        'http://farm',
        photo.farm,
        '.static.flickr.com/',
        photo.server,
        '/',
        photo.id,
        '_',
        photo.secret,
        '_q.jpg' // Change 'q' to something else for different sizes
      ].join(''); // Return a string by join()ing the array elements.
    };
    jsonp(flickrURL, flickrParams, {callback: 'jsoncallback'}).then((results) => {
        console.log(results)
      const images = results.photos.photo.map(generateURL);
      this.setState({images: images[Math.floor(Math.random())]});
    });

    this.fetchLocation(q);
  }

  fetchLocation(q) {
    Geocode.fromAddress(q).then((respond)=>{
      console.log(respond);
      const lat = respond.results[0].geometry.location.lat
      // console.log(lat);
      const lng = respond.results[0].geometry.location.lng
      const city = respond.results[0].formatted_address
      this.setState({
        center:{
        lat: lat,
        lng: lng
        },
        city: city
      })
    }
    )
  }

  render() {
  console.log(this.state.city)
  console.log(this.state.images)
    return (

      <div className="container">
        <h1> Travel Search </h1>
        <SearchForm onSubmit = {this.fetchImages} />
        <div className="images">

            <City images = {this.state.images} />

          <div style={{height: '50vh', width: '40vw'}} id="map">
            <GoogleMapReact
              bootstrapURLKeys ={{ key:"AIzaSyCwJPU1FogYVi9_urDFMPFQ0O8qFLbFZpc" }}
              center= {this.state.center}
              defaultZoom={this.state.zoom}>

            </GoogleMapReact>
          </div>

        </div>
        <div className="weather">
          <ReactWeather
            forcast= "today"
            apikey= "d52e578f19b04d67992115225181809"
            type="city"
            city= {this.state.city}
            // city="sydney"
          />

        </div>
      </div>
    )

  }
};

class SearchForm extends Component {

  constructor() {
    super();
    this.state = { query: ''};
    this._handleInput = this._handleInput.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleInput(e) {
    this.setState( {query: e.target.value})
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit( this.state.query);
  }

  render() {
    return (
      <form onSubmit = { this._handleSubmit }>
        <input className="input" type="search" placeholder="Destination" onInput={this._handleInput} />
        <input className="search-button" type="submit" value="Search" />
      </form>
     )
  };
}

class City extends Component {
  render() {
    return (
      <div>
         <img src = {this.props.images} />
      </div>
    )
  };
}






export default FlickrSearch;
