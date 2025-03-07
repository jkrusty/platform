import { expect, type Locator, type Page } from '@playwright/test'
import { CommonPage } from './common-page'

export class ChannelPage extends CommonPage {
  readonly page: Page

  constructor (page: Page) {
    super(page)
    this.page = page
  }

  readonly inputMessage = (): Locator => this.page.locator('div[class~="text-editor-view"]')
  readonly buttonSendMessage = (): Locator => this.page.locator('g#Send')
  readonly textMessage = (messageText: string): Locator =>
    this.page.locator('.hulyComponent .activityMessage', { hasText: messageText })

  readonly channelName = (channel: string): Locator => this.page.getByText('general random').getByText(channel)
  readonly channelTab = (): Locator => this.page.getByRole('link', { name: 'Channels' }).getByRole('button')
  readonly channelTable = (): Locator => this.page.getByRole('table')
  readonly channel = (channel: string): Locator => this.page.getByRole('button', { name: channel })
  readonly channelNameOnDetail = (channel: string): Locator =>
    this.page
      .locator('span.labelOnPanel', { hasText: 'Name' })
      .locator('xpath=following-sibling::div[1]')
      .locator('button', { hasText: channel })

  readonly chooseChannel = (channel: string): Locator => this.page.getByRole('button', { name: channel })
  readonly closePopupWindow = (): Locator => this.page.locator('.notifyPopup button[data-id="btnNotifyClose"]')
  readonly openAddMemberToChannel = (userName: string): Locator => this.page.getByRole('button', { name: userName })
  readonly addMemberToChannelButton = (userName: string): Locator => this.page.getByText(userName)
  readonly joinChannelButton = (): Locator => this.page.getByRole('button', { name: 'Join' })
  readonly addEmojiButton = (): Locator =>
    this.page.locator('.activityMessage-actionPopup > button[data-id$="AddReactionAction"]').last()

  readonly selectEmoji = (emoji: string): Locator => this.page.getByText(emoji)
  readonly saveMessageButton = (): Locator =>
    this.page.locator('.activityMessage-actionPopup > button[data-id$="SaveForLaterAction"]').last()

  readonly pinMessageButton = (): Locator =>
    this.page.locator('.activityMessage-actionPopup > button[data-id$="PinMessageAction"]').last()

  readonly replyButton = (): Locator =>
    this.page.locator('.activityMessage-actionPopup > button[data-id$="ReplyToThreadAction"]').last()

  readonly openMoreButton = (): Locator =>
    this.page.locator('.activityMessage-actionPopup > button[data-id="btnMoreActions"]').last()

  readonly messageSaveMarker = (): Locator => this.page.locator('.saveMarker')
  readonly saveMessageTab = (): Locator => this.page.getByRole('button', { name: 'Saved' })
  readonly pinnedMessageButton = (): Locator => this.page.getByRole('button', { name: 'pinned' })
  readonly pinnedMessage = (message: string): Locator => this.page.locator('.antiPopup').getByText(message)
  readonly closeReplyButton = (): Locator => this.page.locator('.hulyHeader-container > button.iconOnly')
  readonly openReplyMessage = (): Locator => this.page.getByText('1 reply Last reply less than')
  readonly editMessageButton = (): Locator => this.page.getByRole('button', { name: 'Edit' })
  readonly copyLinkButton = (): Locator => this.page.getByRole('button', { name: 'Copy link' })
  readonly deleteMessageButton = (): Locator => this.page.getByRole('button', { name: 'Delete' })
  readonly updateButton = (): Locator => this.page.getByRole('button', { name: 'Update' })
  readonly openChannelDetails = (): Locator => this.page.locator('.hulyHeader-buttonsGroup > .antiButton')
  readonly changeChannelNameConfirm = (): Locator => this.page.locator('.selectPopup button')
  readonly privateOrPublicChangeButton = (change: string, autoJoin: boolean): Locator =>
    this.page
      .locator('span.labelOnPanel', { hasText: autoJoin ? 'Auto join' : 'Private' })
      .locator('xpath=following-sibling::div[1]')
      .locator('button', { hasText: change })

  readonly privateOrPublicPopupButton = (change: string): Locator =>
    this.page.locator('div.popup div.menu-item', { hasText: change })

  readonly userAdded = (user: string): Locator => this.page.locator('.members').getByText(user)
  private readonly addMemberPreview = (): Locator => this.page.getByRole('button', { name: 'Add members' })
  private readonly addButtonPreview = (): Locator => this.page.getByRole('button', { name: 'Add', exact: true })

  async sendMessage (message: string): Promise<void> {
    await this.inputMessage().fill(message)
    await this.buttonSendMessage().click()
  }

  async sendMention (message: string): Promise<void> {
    await this.inputMessage().fill(`@${message}`)
    await this.selectMention(message)
    await this.buttonSendMessage().click()
  }

  async clickOnOpenChannelDetails (): Promise<void> {
    await this.openChannelDetails().click()
  }

  async clickChannel (channel: string): Promise<void> {
    await this.channel(channel).click()
  }

  async changeChannelName (channel: string): Promise<void> {
    await this.channelNameOnDetail(channel).click()
    await this.page.keyboard.type('New Channel Name')
    await this.changeChannelNameConfirm().click()
  }

  async changeChannelPrivacyOrAutoJoin (
    change: string,
    YesNo: string,
    changed: string,
    autoJoin: boolean = false
  ): Promise<void> {
    await this.privateOrPublicChangeButton(change, autoJoin).click()
    await this.page.waitForTimeout(200)
    await this.privateOrPublicPopupButton(YesNo).click()
    await expect(this.privateOrPublicChangeButton(changed, autoJoin)).toBeVisible()
  }

  async clickDeleteMessageButton (): Promise<void> {
    await this.deleteMessageButton().click()
  }

  async clickSaveMessageTab (): Promise<void> {
    await this.saveMessageTab().click()
  }

  async clickPinMessageButton(): Promise<void> {
    await this.pinnedMessageButton().click()
  }

  async addMemberToChannelPreview (user: string): Promise<void> {
    await this.addMemberPreview().click()
    await this.addMemberToChannelButton(user).click()
    await this.addButtonPreview().click()
    await expect(this.userAdded(user)).toBeVisible()
  }

  async checkIfUserIsAdded (user: string, added: boolean): Promise<void> {
    if (added) {
      await expect(this.userAdded(user)).toBeHidden()
    } else {
      await expect(this.userAdded(user)).toBeVisible()
    }
  }

  async clickOpenMoreButton (message: string): Promise<void> {
    await this.textMessage(message).hover()
    await this.openMoreButton().click()
  }

  async clickEditMessageButton (editedMessage: string): Promise<void> {
    await this.editMessageButton().click()
    await this.page.waitForTimeout(500)
    await this.page.keyboard.type(editedMessage)
  }

  async clickCopyLinkButton (): Promise<void> {
    await this.copyLinkButton().click()
  }

  async clickOnUpdateButton (): Promise<void> {
    await this.updateButton().click()
  }

  async getClipboardCopyMessage (): Promise<void> {
    await this.page.evaluate(async () => {
      return await navigator.clipboard.readText()
    })
  }

  async checkIfMessageIsCopied (message: string): Promise<void> {
    expect(this.getClipboardCopyMessage()).toContain(message)
  }

  async clickChooseChannel (channel: string): Promise<void> {
    await this.chooseChannel(channel).click({ force: true })
  }

  async addEmoji (textMessage: string, emoji: string): Promise<void> {
    await this.textMessage(textMessage).hover()
    await this.addEmojiButton().click()
    await this.selectEmoji(emoji).click()
  }

  async saveMessage (message: string): Promise<void> {
    await this.textMessage(message).hover()
    await this.saveMessageButton().click()
    await expect(this.messageSaveMarker()).toBeVisible()
  }

  async pinMessage (message: string): Promise<void> {
    await this.textMessage(message).hover()
    await this.pinMessageButton().click()
    await this.pinnedMessageButton().click()
    await expect(this.pinnedMessage(message)).toBeVisible()
  }

  async unpinMessage (message: string): Promise<void> {
    await this.textMessage(message).hover()
    await this.pinMessageButton().click()
    await this.pinnedMessageButton().click()
    await expect(this.pinnedMessage(message)).not.toBeVisible()
  }

  async replyToMessage (message: string, messageReply: string): Promise<void> {
    await this.textMessage(message).hover()
    await this.replyButton().click()
    await this.page.waitForTimeout(500)
    await this.page.keyboard.type(messageReply)
    await this.page.keyboard.press('Enter')
  }

  async closeAndOpenReplyMessage (): Promise<void> {
    await this.closeReplyButton().click()
    await this.openReplyMessage().click()
  }

  async clickChannelTab (): Promise<void> {
    await this.channelTab().click()
  }

  async clickOnClosePopupButton (): Promise<void> {
    await this.closePopupWindow().click()
  }

  async clickOnUser (user: string): Promise<void> {
    await this.addMemberToChannelButton(user).click()
  }

  async addMemberToChannel (user: string): Promise<void> {
    await this.openAddMemberToChannel(user).click()
  }

  async clickJoinChannelButton (): Promise<void> {
    await this.joinChannelButton().click()
  }

  async checkIfChannelDefaultExist (shouldExist: boolean, channel: string): Promise<void> {
    if (shouldExist) {
      await expect(this.channelName(channel)).toBeVisible()
    } else {
      await expect(this.channelName(channel)).toBeHidden()
    }
  }

  async checkIfChannelTableExist (channel: string, publicChannel: boolean): Promise<void> {
    if (publicChannel) {
      await expect(this.channelTable()).toBeVisible()
      await expect(this.channelTable()).toContainText(channel)
    } else {
      await expect(this.channelTable()).not.toContainText(channel)
    }
  }

  async checkIfMessageExist (messageExists: boolean, messageText: string): Promise<void> {
    if (messageExists) {
      await expect(this.textMessage(messageText)).toBeVisible()
    } else {
      await expect(this.textMessage(messageText)).toBeHidden()
    }
  }

  async checkMessageExist (message: string, messageExists: boolean, messageText: string): Promise<void> {
    if (messageExists) {
      await expect(this.textMessage(messageText)).toBeVisible()
    } else {
      await expect(this.textMessage(messageText)).toBeHidden()
    }
  }

  async checkIfEmojiIsAdded (emoji: string): Promise<void> {
    await expect(this.selectEmoji(emoji + ' 1')).toBeVisible()
  }

  async checkIfNameIsChanged (channel: string): Promise<void> {
    await expect(this.channel(channel).nth(0)).toBeVisible()
    await expect(this.channel(channel).nth(1)).toBeVisible()
    await expect(this.channel(channel).nth(2)).toBeVisible()
  }
}
