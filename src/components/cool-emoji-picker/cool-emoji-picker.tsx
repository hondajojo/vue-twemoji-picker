// Core
import { Component, Prop, State, h } from '@stencil/core';

// Third Party
import Popper from 'popper.js';

import EmojiService from '../../services/emoji-service';

// Models
import { TwemojiOptions } from '../../models/twemoji-options';
import { EmojiPack } from '../../models/emoji-pack';
import { EmojiObject } from '../../models/emoji-object';
import { EmojiGroup } from '../../models/emoji-group';

// JSON STATIC
import EmojiGroups from '../../static/emoji-groups.json';

@Component({
  tag: 'cool-emoji-picker',
  styleUrl: 'cool-emoji-picker.css',
  shadow: true
})
export class CoolEmojiPicker {
  btnElement: HTMLButtonElement;
  popperDiv: HTMLDivElement;
  popperInstance: Popper;
  emojiGroups: Array<EmojiGroup> = EmojiGroups;

  // ====> Props
  @Prop() btnEmojiClasses: string = '';

  @Prop() twemojiPath: string = 'https://twemoji.maxcdn.com/2/';
  @Prop() twemojiExtension: string = '.png';
  @Prop() twemojiFolder: string = '72x72';
  @Prop() emojiData: Array<EmojiPack> = [];

  @Prop() pickerWidth: number = 250;
  @Prop() pickerMaxHeight: number = 200;

  @Prop() skinsSelection: boolean = false;
  @Prop() recentEmojisFeat: boolean = false;
  @Prop() recentEmojiLimit: number = 12;
  @Prop() recentEmojiStorageName: string = 'cep-recent-emojis';

  // ====> State
  @State() showPopper: boolean = false;
  @State() isPointerOnEmojiBtn: boolean = false;
  @State() randomEmoji: string = '🤔';
  @State() showSkinsSelector: boolean = false;
  @State() skinsListActive: Array<EmojiObject> = [];
  @State() searchTerm: string = '';

  @State() emojiPack: Array<EmojiPack> = [];
  @State() emojiListActive: Array<EmojiObject> = [];
  @State() emojiGroupActive: number = 0;
  @State() recentEmojis: Array<EmojiObject> = [];

  @State() twemojiOptions: TwemojiOptions = {
    base: this.twemojiPath,
    ext: this.twemojiExtension,
    size: this.twemojiFolder
  };

  componentDidLoad() {
    // TODO: BUG RANDOM EMOJI PEGANDO DOIS EMOJIS (CAVEIRINHA E BUBLE SPEECH)
    // TODO: Ver como fazer appendToBody...
    this.bootEmojiPicker();
    this.popperInstance = new Popper(this.btnElement, this.popperDiv, {
      placement: 'bottom',
      modifiers: {
        flip: {
          enabled: false
        }
      }
    });
  }

  componentWillUpdate() {
    this.bootEmojiPicker();
  }

  private bootEmojiPicker() {
    if (this.emojiPack.length === 0) {
      this.buildEmojiPack();
      if (this.emojiPack.length !== 0) {
        this.emojiListActive = this.emojiPack[0].emojiList;
        this.setRandomEmoji();
      }
    }
    /* TODO: ADD RECENT EMOJIS FEAT
    if (this.recentEmojisFeat) {
      this.setRecentEmojis();
    }*/
  }

  private onClickBtnEmoji() {
    this.showPopper = !this.showPopper;
    if (this.showPopper) {
      this.popperDiv.style.display = 'block';
    } else {
      this.popperDiv.style.display = 'none';
    }
  }

  private buildEmojiPack() {
    this.emojiPack = EmojiService.getEmojiImgArrayFromEmojiPack(
      this.emojiData,
      this.twemojiOptions
    );
  }

  private changeEmojiListActive(index) {
    this.showSkinsSelector = false;
    this.searchTerm = '';
    this.emojiGroupActive = index;
    if (index >= 0) {
      this.emojiListActive = this.emojiPack[index].emojiList;
    } else if (index === -1) {
      this.emojiListActive = this.recentEmojis;
    }
  }

  private onMouseEnterEmojiBtn() {
    if (this.isPointerOnEmojiBtn === false) {
      this.isPointerOnEmojiBtn = true;
      this.setRandomEmoji();
    }
  }

  private onMouseLeaveEmojiBtn() {
    if (this.isPointerOnEmojiBtn === true) {
      this.isPointerOnEmojiBtn = false;
    }
  }

  private setRandomEmoji() {
    let emoji: EmojiObject = { unicode: '🤔' };
    if (this.emojiPack.length !== 0) {
      emoji = this.emojiPack[0].emojiList[
        Math.floor(Math.random() * (this.emojiPack[0].emojiList.length - 1))
      ];
    }
    this.randomEmoji = emoji.unicode;
  }

  private getRandomEmojiImg() {
    return EmojiService.getEmojiImgFromUnicode(
      this.randomEmoji,
      this.twemojiOptions
    );
  }

  private getEmojiGroupDescription(emojiGroup) {
    if (this.emojiGroups.length > 0) {
      return EmojiService.getEmojiImgFromUnicode(
        this.emojiGroups.find(x => x.group === emojiGroup).description,
        this.twemojiOptions
      );
    }
    return 'Group ' + emojiGroup;
  }

  private addEmojiToRecentEmojis(emojiUnicode) {
    const indexToRemove = this.recentEmojis.findIndex(
      x => x.unicode === emojiUnicode
    );
    if (indexToRemove !== -1) {
      this.recentEmojis.splice(indexToRemove, 1);
      this.recentEmojis.unshift({
        unicode: emojiUnicode,
        img: EmojiService.getEmojiImgFromUnicode(
          emojiUnicode,
          this.twemojiOptions
        )
      });
    } else {
      this.recentEmojis.unshift({
        unicode: emojiUnicode,
        img: EmojiService.getEmojiImgFromUnicode(
          emojiUnicode,
          this.twemojiOptions
        )
      });
    }

    if (this.recentEmojis.length > this.recentEmojiLimit) {
      this.recentEmojis.splice(-1, 1);
    }

    localStorage.setItem(
      this.recentEmojiStorageName,
      JSON.stringify(this.recentEmojis)
    );
  }

  private clickEmoji(emoji: EmojiObject) {
    let emojiUnicode: string;
    if (
      emoji.skins !== undefined &&
      emoji.skins.length !== 0 &&
      this.skinsSelection
    ) {
      this.skinsListActive = Array.from(emoji.skins);
      this.skinsListActive.unshift({ unicode: emoji.unicode, img: emoji.img });
      this.showSkinsSelector = true;
      return;
    } else {
      emojiUnicode = emoji.unicode;
    }

    if (this.recentEmojisFeat) {
      this.addEmojiToRecentEmojis(emojiUnicode);
    }

    // TODO: Adicionar "flechinha" que liga ao componente de emoji
    // TODO: Adicionar behaviour de quando clicar fora do componente ele fechar (deixar isso configurável)
    // TODO: Adicionar possibilidade de search ao componente nas tags e props configuráveis
    // TODO: Adicionar Possibilidade de skins
    // TODO: Melhorar estilo da bordar adicionando um box shadow acinzentado em toda os lados de borda do componente

    /* TODO: Emit Events
      this.$emit('addTextBlur', emojiUnicode);
      this.$emit('emojiUnicodeAdded', emojiUnicode);
      this.$emit('emojiImgAdded', EmojiService.getEmojiImgFromUnicode(emojiUnicode, this.twemojiOptions));
      */
  }

  private renderEmojiGroups() {
    const emojiGroupTags: Array<HTMLSpanElement> = [];
    for (let index = 0; index < this.emojiPack.length; index++) {
      const group = this.emojiPack[index].group;
      const activeClass = this.emojiGroupActive === index ? 'active' : '';
      emojiGroupTags.push(
        <span
          innerHTML={this.getEmojiGroupDescription.bind(this, group)()}
          class={'emoji-tab ' + activeClass}
          onClick={this.changeEmojiListActive.bind(this, index)}
        />
      );
    }
    return emojiGroupTags;
  }

  private renderEmojiList() {
    const emojiTags: Array<HTMLSpanElement> = [];
    for (let index = 0; index < this.emojiListActive.length; index++) {
      const emoji = this.emojiListActive[index];
      emojiTags.push(
        <span
          innerHTML={emoji.img}
          onClick={this.clickEmoji.bind(this, emoji)}
        />
      );
    }
    return emojiTags;
  }

  render() {
    return (
      <div id="cool-emoji-picker">
        <div
          id="popper"
          class="tooltip-inner popover-inner disable-user-select"
          ref={el => (this.popperDiv = el as HTMLDivElement)}
        >
          <div id="emoji-popup" style={{ width: this.pickerWidth + 'px' }}>
            <div id="emoji-popover-header" class="scroll-clean scroll-min">
              {this.renderEmojiGroups()}
            </div>

            <div
              class="scroll-clean emoji-popover-inner"
              style={{
                width: this.pickerWidth + 'px',
                maxHeight: this.pickerMaxHeight + 'px'
              }}
            >
              <div v-if="emojiListActive.length !== 0">
                <p class="emoji-list">{this.renderEmojiList()}</p>
              </div>
            </div>
          </div>
        </div>
        <button
          id="btn-emoji"
          onMouseEnter={this.onMouseEnterEmojiBtn.bind(this)}
          onMouseLeave={this.onMouseLeaveEmojiBtn.bind(this)}
          onClick={this.onClickBtnEmoji.bind(this)}
          class={this.btnEmojiClasses}
          ref={el => (this.btnElement = el as HTMLButtonElement)}
        >
          <div innerHTML={this.getRandomEmojiImg()} />
        </button>
      </div>
    );
  }
}
