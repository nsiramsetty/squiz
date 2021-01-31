import React, { Component } from 'react';
// for shimmer effect
import ContentLoader from 'react-content-loader';

export class TopicsLoader extends Component {
  render() {
    return (
      <div>
        <div className="it-hero-secion">
          <div className="it-jumbotron it-jumbotron-fluid it-jumbotron-teacher">
            {/* <img src={publisherData.avatar.medium} alt="" style={{ width: '100%' }} className="it-blur-img" /> */}
            <div className="it-jumbotron-container-topic-slug">
              <div className="it-desktop-view d-none d-sm-block">
                <ContentLoader
                  ariaLabel="Course Loading.."
                  height={475}
                  width={400}
                  speed={0.5}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  viewBox="0 0 400 300"
                  {...this.props}
                >
                  {/* <circle cx="200" cy="30" r="30" /> */}

                  <rect x="100" y="50" rx="0" ry="0" width="200" height="16" />
                  <rect x="100" y="80" rx="0" ry="0" width="200" height="16" />
                  <rect x="100" y="110" rx="0" ry="0" width="200" height="16" />

                  <rect x="80" y="160" rx="0" ry="0" width="55" height="16" />
                  <rect x="140" y="160" rx="0" ry="0" width="55" height="16" />
                  <rect x="200" y="160" rx="0" ry="0" width="55" height="16" />
                  <rect x="260" y="160" rx="0" ry="0" width="55" height="16" />
                </ContentLoader>
              </div>
              <div className="it-mobile-view d-block d-sm-none">
                <ContentLoader
                  ariaLabel="Course Loading.."
                  height={475}
                  width={400}
                  speed={0.5}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  viewBox="0 0 400 400"
                  {...this.props}
                >
                  {/* <rect x="0" y="0" rx="0" ry="0" width="400" height="40" />
                                    <rect x="0" y="70" rx="0" ry="0" width="400" height="40" /> */}

                  {Array(3)
                    .fill()
                    .map((_, id) => (
                      <rect
                        key={id}
                        x="45"
                        y={id * 30 + 10}
                        rx="0"
                        ry="0"
                        width="300"
                        height="20"
                      />
                    ))}

                  {Array(4)
                    .fill()
                    .map((_, id) => (
                      <rect
                        x={(id + 1) * 65}
                        y="180"
                        rx="0"
                        ry="0"
                        width="50"
                        height="25"
                      />
                    ))}
                  {Array(2)
                    .fill()
                    .map((_, id) => (
                      <rect
                        x={(id + 1) * 65}
                        y="225"
                        rx="0"
                        ry="0"
                        width="50"
                        height="25"
                      />
                    ))}
                  <rect x={200} y="225" rx="0" ry="0" width="70" height="25" />
                  {Array(4)
                    .fill()
                    .map((_, id) => (
                      <rect
                        x={(id + 1) * 65}
                        y="270"
                        rx="0"
                        ry="0"
                        width="60"
                        height="25"
                      />
                    ))}
                </ContentLoader>
              </div>
            </div>
          </div>
          {/* <div className="it-home-second-division">
                        <div className='container'>
                            <div className="container">
                                <ContentLoader
                                    height={475}
                                    width={400}
                                    speed={0.5}
                                    primaryColor="#f3f3f3"
                                    secondaryColor="#ecebeb"
                                    {...this.props}
                                >
                                    <rect x="0" y="0" rx="2" ry="2" width="50" height="50" />

                                    <rect x="100" y="0" rx="0" ry="0" width="300" height="10" />
                                    <rect x="125" y="20" rx="0" ry="0" width="250" height="10" />
                                    <rect x="100" y="40" rx="0" ry="0" width="300" height="10" />

                                </ContentLoader>
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    );
  }
}

export class TopicsSlugLoader extends Component {
  render() {
    return (
      <div>
        <div className="it-hero-secion">
          <div className="it-jumbotron it-jumbotron-fluid it-jumbotron-teacher it-min-height-50">
            {/* <img src={publisherData.avatar.medium} alt="" style={{ width: '100%' }} className="it-blur-img" /> */}
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
                  {/* <circle cx="200" cy="30" r="30" /> */}

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
                  {/* <rect x="0" y="0" rx="0" ry="0" width="400" height="40" />
                                    <rect x="0" y="70" rx="0" ry="0" width="400" height="40" /> */}

                  {Array(3)
                    .fill()
                    .map((_, id) => (
                      <rect
                        key={id}
                        x="45"
                        y={id * 30 + 850}
                        rx="0"
                        ry="0"
                        width="300"
                        height="20"
                      />
                    ))}

                  {/* <rect x={0 + 0} y="200" rx="0" ry="0" width="200" height="200" />
                                    <rect x={0 + 0} y="500" rx="0" ry="0" width="200" height="200" /> */}
                  <rect
                    x={70}
                    y="1000"
                    rx="20"
                    ry="20"
                    width="250"
                    height="250"
                  />
                  {/* <rect x={70} y="1200" rx="20" ry="20" width="250" height="250" /> */}
                </ContentLoader>
              </div>
            </div>
          </div>
          {/* <div className="it-home-second-division">
                        <div className='container'>
                            <div className="container">
                                <ContentLoader
                                    height={475}
                                    width={400}
                                    speed={0.5}
                                    primaryColor="#f3f3f3"
                                    secondaryColor="#ecebeb"
                                    {...this.props}
                                >
                                    <rect x="0" y="0" rx="2" ry="2" width="50" height="50" />

                                    <rect x="100" y="0" rx="0" ry="0" width="300" height="10" />
                                    <rect x="125" y="20" rx="0" ry="0" width="250" height="10" />
                                    <rect x="100" y="40" rx="0" ry="0" width="300" height="10" />

                                </ContentLoader>
                            </div>
                        </div>
                    </div> */}
        </div>
      </div>
    );
  }
}

export class TopicFilterLoader extends Component {
  render() {
    return (
      <div>
        <div className="it-hero-secion">
          <div className="it-jumbotron it-jumbotron-fluid it-jumbotron-teacher">
            {/* <img src={publisherData.avatar.medium} alt="" style={{ width: '100%' }} className="it-blur-img" /> */}
            <div className="it-jumbotron-container-topic-slug">
              <div className="it-desktop-view d-none d-sm-block">
                <ContentLoader
                  ariaLabel="Course Loading.."
                  height={1000}
                  width={1000}
                  speed={0.5}
                  style={{ background: '' }}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  // viewBox={`0 0 ${width} ${height}`}
                  {...this.props}
                >
                  <rect
                    x={50 - 20}
                    y={200 + 50}
                    rx="0"
                    ry="0"
                    width="100"
                    height="25"
                  />
                  <rect
                    x={50 - 20}
                    y={235 + 50}
                    rx="0"
                    ry="0"
                    width="1000"
                    height="20"
                  />
                  <rect
                    x={50 - 20}
                    y={265 + 50}
                    rx="0"
                    ry="0"
                    width="300"
                    height="20"
                  />

                  <rect
                    x={50 - 20}
                    y={295 + 60}
                    rx="0"
                    ry="0"
                    width="180"
                    height="15"
                  />

                  <rect
                    x={50 - 20}
                    y={320 + 60}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={120 - 20}
                    y={320 + 60}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={190 - 20}
                    y={320 + 60}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={260 - 20}
                    y={320 + 60}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />

                  <rect
                    x={50 - 20}
                    y={355 + 70}
                    rx="0"
                    ry="0"
                    width="180"
                    height="15"
                  />

                  <rect
                    x={50 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={120 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={190 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={260 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={330 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={400 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={470 - 20}
                    y={380 + 70}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />

                  <rect
                    x={50 - 20}
                    y={415 + 80}
                    rx="0"
                    ry="0"
                    width="180"
                    height="15"
                  />

                  <rect
                    x={50 - 20}
                    y={440 + 80}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={120 - 20}
                    y={440 + 80}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={190 - 20}
                    y={440 + 80}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                  <rect
                    x={260 - 20}
                    y={440 + 80}
                    rx="0"
                    ry="0"
                    width="60"
                    height="25"
                  />
                </ContentLoader>
              </div>
              <div className="it-mobile-view d-block d-sm-none">
                <ContentLoader
                  ariaLabel="Course Loading.."
                  height={475}
                  width={400}
                  speed={0.5}
                  primaryColor="#f3f3f3"
                  secondaryColor="#ecebeb"
                  viewBox="0 0 400 400"
                  {...this.props}
                >
                  {/* <rect x="0" y="0" rx="0" ry="0" width="400" height="40" />
                                    <rect x="0" y="70" rx="0" ry="0" width="400" height="40" /> */}

                  <rect x="50" y={0} rx="0" ry="0" width="100" height="20" />
                  <rect x="50" y={30} rx="0" ry="0" width="300" height="15" />
                  <rect x="50" y={55} rx="0" ry="0" width="300" height="15" />
                  <rect x="50" y={80} rx="0" ry="0" width="300" height="15" />

                  <rect x="50" y={160} rx="0" ry="0" width="60" height="30" />
                  <rect x="120" y={160} rx="0" ry="0" width="60" height="30" />
                  <rect x="190" y={160} rx="0" ry="0" width="60" height="30" />
                  <rect x="260" y={160} rx="0" ry="0" width="60" height="30" />

                  <rect x="50" y={200} rx="0" ry="0" width="60" height="30" />
                  <rect x="120" y={200} rx="0" ry="0" width="60" height="30" />
                  <rect x="190" y={200} rx="0" ry="0" width="60" height="30" />
                  {/* <rect x="260" y={190} rx="0" ry="0" width="60" height="30" /> */}

                  <rect x="50" y={240} rx="0" ry="0" width="60" height="30" />
                  <rect x="120" y={240} rx="0" ry="0" width="60" height="30" />
                  <rect x="190" y={240} rx="0" ry="0" width="60" height="30" />
                  <rect x="260" y={240} rx="0" ry="0" width="60" height="30" />

                  {/* {Array(3).fill().map((_, id) =>
                                        <rect x="50" y={(id + 1 * 30)} rx="0" ry="0" width="300" height="20" />
                                    )} */}
                </ContentLoader>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
