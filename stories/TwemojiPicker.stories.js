import EmojiAllData from '../emoji-data/en/emoji-all-groups.json';
import EmojiGroups from '../emoji-data/emoji-groups.json';

import Vue from 'vue';
import TwemojiPicker from '../src/components/TwemojiPicker.vue';
import TwemojiTextarea from '../src/components/TwemojiTextarea.vue';
import { storiesOf } from '@storybook/vue';

storiesOf('TwemojiPicker', module).add('common usage', () => ({
  components: { 'twemoji-picker': TwemojiPicker },
  computed: {
    emojiDataAll() {
      return EmojiAllData;
    },
    emojiGroups() {
      return EmojiGroups;
    }
  },
  data() {
    return {
      searchEmojisFeat: true,
      searchEmojiPlaceholder: 'Search here.',
      searchEmojiNotFound: 'Emojis not found.',
      isLoadingLabel: 'Loading...'
    };
  },
  template: `<twemoji-picker 
    :emojiData="emojiDataAll"
    :emojiGroups="emojiGroups"
    :skinsSelection="true"
    :searchEmojisFeat="searchEmojisFeat"
    :searchEmojiPlaceholder="searchEmojiPlaceholder"
    :searchEmojiNotFound="searchEmojiNotFound"
    :isLoadingLabel="isLoadingLabel" 
  />`
}));
