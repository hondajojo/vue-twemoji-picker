import Twemoji from 'twemoji';
import { TwemojiOptions } from '../models/twemoji-options';
import { EmojiPack } from '../models/emoji-pack';
import { EmojiObject } from '../models/emoji-object';

export default {
  getEmojiImgFromUnicode(unicode: string, twemojiOptions: TwemojiOptions) {
    return Twemoji.parse(unicode, twemojiOptions);
  },
  getEmojiImgArrayFromEmojiPack(
    emojiPack: Array<EmojiPack>,
    twemojiOptions: TwemojiOptions
  ) {
    emojiPack = JSON.parse(JSON.stringify(emojiPack));
    let emojiPackWithImg = [];

    if (emojiPack !== undefined && emojiPack.length !== 0) {
      for (let i = 0; i < emojiPack.length; i++) {
        emojiPackWithImg[i] = {};
        emojiPackWithImg[i].group = emojiPack[i].group;
        emojiPackWithImg[i].emojiList = [];

        for (let j = 0; j < emojiPack[i].emojiList.length; j++) {
          const emoji: EmojiObject = {};

          if (
            emojiPack[i].emojiList[j].skins !== undefined &&
            emojiPack[i].emojiList[j].skins.length !== 0
          ) {
            emoji.unicode = emojiPack[i].emojiList[j].unicode;
            emoji.skins = [];
            for (let k = 0; k < emojiPack[i].emojiList[j].skins.length; k++) {
              const skinObject: EmojiObject = {};
              skinObject.unicode = emojiPack[i].emojiList[j].skins[k].unicode;
              skinObject.img = this.getEmojiImgFromUnicode(
                emojiPack[i].emojiList[j].skins[k].unicode,
                twemojiOptions
              );
              emoji.skins.push(skinObject);
            }
          } else {
            emoji.unicode = emojiPack[i].emojiList[j].unicode;
          }

          emoji.img = this.getEmojiImgFromUnicode(
            emoji.unicode,
            twemojiOptions
          );
          emojiPackWithImg[i].emojiList.push(emoji);
        }
      }
    }

    return emojiPackWithImg;
  },
  getEmojiImgArrayFromEmojiPackByTerm(
    emojiPack: Array<EmojiPack>,
    twemojiOptions: TwemojiOptions,
    searchTerm: string
  ) {
    emojiPack = JSON.parse(JSON.stringify(emojiPack));
    let emojiPackWithImg = [];

    if (emojiPack !== undefined && emojiPack.length !== 0) {
      for (let i = 0; i < emojiPack.length; i++) {
        for (let j = 0; j < emojiPack[i].emojiList.length; j++) {
          const emoji: EmojiObject = {};

          if (
            emojiPack[i].emojiList[j].skins !== undefined &&
            emojiPack[i].emojiList[j].skins.length !== 0
          ) {
            emoji.unicode = emojiPack[i].emojiList[j].unicode;
            emoji.skins = [];
            for (let k = 0; k < emojiPack[i].emojiList[j].skins.length; k++) {
              const skinObject: EmojiObject = {};
              skinObject.unicode = emojiPack[i].emojiList[j].skins[k].unicode;
              skinObject.img = this.getEmojiImgFromUnicode(
                emojiPack[i].emojiList[j].skins[k].unicode,
                twemojiOptions
              );
              emoji.skins.push(skinObject);
            }
          } else {
            emoji.unicode = emojiPack[i].emojiList[j].unicode;
          }

          emoji.img = this.getEmojiImgFromUnicode(
            emoji.unicode,
            twemojiOptions
          );

          for (let k = 0; k < emojiPack[i].emojiList[j].tags.length; k++) {
            if (emojiPack[i].emojiList[j].tags[k].includes(searchTerm)) {
              emojiPackWithImg.push(emoji);
              break;
            }
          }
        }
      }
    }

    return emojiPackWithImg;
  }
};
