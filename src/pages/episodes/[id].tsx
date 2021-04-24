import { GetStaticPaths, GetStaticProps } from 'next';
import { api } from '../../services/api';
import { format, parseISO } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import { convertDurationToTimeString } from '../../utils/converter';
import { usePlayer } from "../../contexts/PlayerContext";

import Image from 'next/image';
import Link from 'next/link';
import Head from "next/head";

import styles from './episode.module.scss';

type Episode = {
    id: string,
    title: string,
    thumbnail: string,
    members: string,
    publishedAt: string,
    duration: number,
    durationAsString: string,
    url: string,
    description: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr </title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Return"/>
                    </button>
                </Link>

                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Play episode" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div 
                className={styles.description}
                //TODO: Escape HTML instead.
                dangerouslySetInnerHTML={{ __html: episode.description }}  
            />
        </div>
    )
}

/*
getStaticPaths is required for dynamic SSG pages and is missing for '/episodes/[id]'.
Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value
*/
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { id } = ctx.params;
    const { data } = await api.get(`/episodes/${id}`);

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: enUS }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(data.file.duration),
        description: data.description,
        url: data.file.url
    };

    return {
       props: {
           episode,
       },
       revalidate: 60 * 60 * 24, //24 hours
    }
}