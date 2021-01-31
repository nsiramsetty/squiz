import Chip from '@material-ui/core/Chip';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

export default class ChipsRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  render() {
    const { isShow } = this.state;
    const { children, classes, data } = this.props;
    const visibleChips = data && data.slice(0, 3);
    const hiddenChips = data && data.slice(3);
    return (
      <>
        {children}
        <div id="topic-benefits-chips" className="">
          <div className="it-chip-block-sub it-mb-20">
            {visibleChips && visibleChips.map(
              (subTag, subId) =>
                subTag.topic !== 'baptisteyoga' &&
                subTag.topic !== 'bikramyoga' &&
                subTag.topic !== 'jangamadhyana' &&
                subTag.topic !== 'hotyoga' &&
                subTag.topic !== 'jivamuktiyoga' &&
                subTag.topic !== 'jainism' && (
                  <NavLink
                    key={subId}
                    onClick={
                      e => {}
                      // logEvent(
                      //   e,
                      //   PageType.TopicsSlug,
                      //   `/meditation-topics/${subTag.topic}`,
                      //   subTag.topic
                      // )
                    }
                    to={`/meditation-topics/${subTag.topic}`}
                  >
                    <Chip
                      icon={
                        subTag.type === 'Genre' ? (
                          <i className="fa fa-music"></i>
                        ) : null
                      }
                      label={subTag.name}
                      className={classes.chip}
                    />
                  </NavLink>
                )
            )}
            {!isShow && hiddenChips && hiddenChips.length > 0 && (
              <Chip
                onClick={() => this.setState({ isShow: true })}
                label={'more..'}
                className={classes.chip}
              />
            )}
            {isShow &&
              isShow === true &&
              hiddenChips.map(
                (subTag, subId) =>
                  subTag.topic !== 'baptisteyoga' &&
                  subTag.topic !== 'bikramyoga' &&
                  subTag.topic !== 'jangamadhyana' &&
                  subTag.topic !== 'hotyoga' &&
                  subTag.topic !== 'jivamuktiyoga' &&
                  subTag.topic !== 'jainism' && (
                    <NavLink
                      key={subId}
                      onClick={
                        e => {}
                        // logEvent(
                        //   PageType.TopicsSlug,
                        //   `/meditation-topics/${subTag.topic}`,
                        //   subTag.topic
                        // )
                      }
                      to={`/meditation-topics/${subTag.topic}`}
                    >
                      <Chip
                        icon={
                          subTag.type === 'Genre' ? (
                            <i className="fa fa-music"></i>
                          ) : null
                        }
                        label={subTag.name}
                        className={classes.chip}
                      />
                    </NavLink>
                  )
              )}
          </div>
        </div>
      </>
    );
  }
}
