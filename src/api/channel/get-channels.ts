import type { Kient } from 'kient'
import type { APIResponse } from '../../util/api-response'
import { Channel } from '../../structures/channel'

export interface ChannelResponse {
	banner_picture: string
	broadcaster_user_id: string
	category: {
		id: number
		name: string
		thumbnail: string
	}
	channel_description: string
	slug: string
	stream: {
		key?: string
		url?: string
		is_live: boolean
		is_mature: boolean
		language: string
		start_time: string
		viewer_count: number
	}
	stream_title: string
}

type GetChannelResponse = APIResponse<ChannelResponse[]>

async function fetchChannels(kient: Kient, params: URLSearchParams): Promise<Channel[]> {
	const response = await kient._apiClient.fetch<GetChannelResponse>(`/channels?${params}`)

	const channelInstances = []
	for (const channelData of response.data) {
		const channel = new Channel(kient, {
			id: channelData.broadcaster_user_id,
			slug: channelData.slug,
			bannerPicture: channelData.banner_picture,
			channelDescription: channelData.channel_description,
			stream: {
				category: channelData.category,
				isLive: channelData.stream.is_live,
				isMature: channelData.stream.is_mature,
				language: channelData.stream.language,
				startTime: channelData.stream.start_time,
				streamTitle: channelData.stream_title,
				viewerCount: channelData.stream.viewer_count,
			},
			ingest: {
				key: channelData.stream.key || '',
				url: channelData.stream.url || '',
			},
		})
		channelInstances.push(channel)
	}

	return channelInstances
}

export async function getChannelsByID(kient: Kient, ids: number[] = []) {
	const params = new URLSearchParams()
	for (const id of ids) {
		params.append('broadcaster_user_id', id.toString())
	}
	return fetchChannels(kient, params)
}

export async function getChannelsBySlugs(kient: Kient, slugs: string[] = []) {
	const params = new URLSearchParams()
	for (const slug of slugs) {
		params.append('slug', slug)
	}
	return fetchChannels(kient, params)
}
