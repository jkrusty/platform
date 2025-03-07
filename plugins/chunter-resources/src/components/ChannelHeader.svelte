<!--
// Copyright © 2023 Hardcore Engineering Inc.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
-->
<script lang="ts">
  import { Class, Doc, Ref } from '@hcengineering/core'
  import { getDocTitle } from '@hcengineering/view-resources'
  import { getClient } from '@hcengineering/presentation'
  import { Channel } from '@hcengineering/chunter'
  import { ActivityMessagesFilter, WithReferences } from '@hcengineering/activity'
  import contact from '@hcengineering/contact'

  import Header from './Header.svelte'
  import chunter from '../plugin'
  import { getObjectIcon, getChannelName } from '../utils'
  import PinnedMessages from './PinnedMessages.svelte'

  export let _id: Ref<Doc>
  export let _class: Ref<Class<Doc>>
  export let object: WithReferences<Doc> | undefined
  export let allowClose: boolean = false
  export let canOpen: boolean = false
  export let withAside: boolean = false
  export let isAsideShown: boolean = false
  export let filters: Ref<ActivityMessagesFilter>[] = []

  const client = getClient()
  const hierarchy = client.getHierarchy()

  let title: string | undefined = undefined
  let description: string | undefined = undefined

  $: void updateDescription(_id, _class, object)

  $: void getChannelName(_id, _class, object).then((res) => {
    title = res
  })

  async function updateDescription (_id: Ref<Doc>, _class: Ref<Class<Doc>>, object?: Doc): Promise<void> {
    if (hierarchy.isDerived(_class, chunter.class.DirectMessage)) {
      description = undefined
    } else if (hierarchy.isDerived(_class, chunter.class.Channel)) {
      description = (object as Channel)?.topic
    } else {
      description = await getDocTitle(client, _id, _class, object)
    }
  }

  $: isPerson =
    hierarchy.isDerived(_class, chunter.class.DirectMessage) || hierarchy.isDerived(_class, contact.class.Person)
</script>

<Header
  bind:filters
  {object}
  icon={getObjectIcon(_class)}
  iconProps={{ value: object, showStatus: true }}
  label={title}
  intlLabel={chunter.string.Channel}
  {description}
  titleKind={isPerson ? 'default' : 'breadcrumbs'}
  withFilters={!hierarchy.isDerived(_class, chunter.class.ChunterSpace)}
  {allowClose}
  {canOpen}
  {withAside}
  {isAsideShown}
  on:aside-toggled
  on:close
>
  {#if object}
    <PinnedMessages {_id} {_class} space={object.space} withRefs={(object.references ?? 0) > 0} on:select />
  {/if}
</Header>
