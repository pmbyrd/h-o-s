"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <a href="#" class="star"> <i data-story-id="${story.storyId}" class="far fa-star"></i></a>
      <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
      <i data-story-id="${story.storyId}" class="fas fa-trash-alt"></i>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function handleSubmitStory(evt) {
  evt.preventDefault();
  console.debug("submitting story");
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const author = $("#story-author").val();
  const username = currentUser.username;
  const storyValues = {
    title: title,
    author: author,
    url: url,
    username: username,
  };
  console.table(storyValues);
  //NOTE - To post a story use the StoryList.addStory() method
  try {
    const newStory = await storyList.addStory(currentUser, storyValues);
    const ownStory = currentUser.ownStories;
    if (newStory instanceof Story) {
      console.log("success");
      currentUser.ownStories.push(newStory);
    }
  } catch (err) {
    console.log(err);
  }
  console.log("story submitted");
  $newStoryForm.hide();
  $allStoriesList.show();
  $newStoryForm.trigger("reset");
}

$submitStory.on("click", handleSubmitStory);

// TODO make a handleDeleteStory()
async function handleDeleteStory(evt) {
  evt.preventDefault();
  console.debug("deleting story");
  const storyId = $(evt.target).attr("data-story-id");
  console.log(storyId);
  if (storyId) {
    await storyList.removeStory(currentUser, storyId);
  }
}

$allStoriesList.on("click", ".fa-trash-alt", handleDeleteStory);



