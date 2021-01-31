import React, { Component } from 'react';
// import ReactDOM from 'react-dom';

// for shimmer effect
import ContentLoader from 'react-content-loader';

class MeditationGroupLoader extends Component {
  render() {
    return (
      <div>
        <div className="it-hero-secion">
          <div className="it-jumbotron it-jumbotron-fluid it-jumbotron-teacher it-min-height-50">
            <div className="it-jumbotron-container-topic-slug">
              <div className="it-desktop-view d-none d-sm-block">
                <ContentLoader
                  ariaLabel="Topics Loading.."
                  width={1167}
                  height={600}
                  speed={0.5}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  viewBox="0 0 1167 600"
                  {...this.props}
                >
                  <rect x="317" y="92" rx="0" ry="0" width="500" height="37" />
                  <rect x="317" y="147" rx="0" ry="0" width="500" height="37" />
                  <rect x="317" y="201" rx="0" ry="0" width="500" height="37" />

                  <rect
                    x="82"
                    y="343"
                    rx="12"
                    ry="12"
                    width="300"
                    height="177"
                  />
                  <rect
                    x="433"
                    y="343"
                    rx="12"
                    ry="12"
                    width="300"
                    height="177"
                  />
                  <rect
                    x="783"
                    y="343"
                    rx="12"
                    ry="12"
                    width="300"
                    height="177"
                  />
                </ContentLoader>
              </div>
              <div className="it-mobile-view d-block d-sm-none">
                <ContentLoader
                  ariaLabel="Topics Loading.."
                  height={3000}
                  width={400}
                  speed={0.5}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  viewBox="0 -500 400 3000"
                  {...this.props}
                >
                  <rect x="45" y={750} rx="0" ry="0" width="300" height="20" />
                  <rect x="45" y={780} rx="0" ry="0" width="300" height="20" />
                  <rect x="45" y={810} rx="0" ry="0" width="300" height="20" />

                  <rect
                    x={45}
                    y="870"
                    rx="20"
                    ry="20"
                    width="300"
                    height="230"
                  />
                </ContentLoader>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MeditationGroupLoader;
