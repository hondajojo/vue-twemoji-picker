import { EmojiObject } from './emoji-object';

export interface EmojiPack {
  group: number;
  emojiList: Array<EmojiObject>;
}
