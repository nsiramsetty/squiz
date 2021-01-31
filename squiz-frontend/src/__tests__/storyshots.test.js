import initStoryshots, { snapshotWithOptions } from '@storybook/addon-storyshots';

initStoryshots({
  test: snapshotWithOptions((story) =>({
    createNodeMock: (element) => {
      if(story.kind === "AudioSlider") {
        return document.createElement("mock")
      }
      return null;
    },
  })),
})