import './globals.css'
import './style.scss'
import Scaffold from '../components/Scaffolding'
import Film from '../components/Film'
import Events from '../components/Events'
import Sponsors from '../components/Sponsors'
import localFont from 'next/font/local'
import { isEmpty, sectionTitles } from '../utils/helpers'
import Questions from '../components/Questions'
import SectionTitle from '../components/SectionTitle'
import SocialHandle from '../components/SocialHandle'
import Marquee from '../components/Marquee'
import ResponsiveIframe from '../components/ResponsiveIframe'
import Link from 'next/link'

// Font files can be colocated inside of `pages`
const myFont = localFont({ src: '../fonts/terminal-grotesque-webfont.woff2' })

const airtableApiKey = process.env.AIRTABLE_API_KEY
const airtableBaseId = process.env.AIRTABLE_BASE_ID
const airtableTableId = process.env.AIRTABLE_TABLE_FILMS_ID
const airtableTableFilmsViewId = process.env.AIRTABLE_TABLE_FILMS_VIEW_ID
const airtableTableFilmEventId = process.env.AIRTABLE_TABLE_FILMEVENTS_ID
const airtableTableFilmEventViewId = process.env.AIRTABLE_TABLE_FILMEVENTS_VIEW_ID
const airtableTableOthersId = process.env.AIRTABLE_TABLE_OTHERS_ID
const airtableTableOthersViewId = process.env.AIRTABLE_TABLE_OTHERS_VIEW_ID

async function getFilmEvents() {
    try {
        const res = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableFilmEventId}?view=${airtableTableFilmEventViewId}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`,
            },
            cache: 'no-store'
        });
        const data = await res.json();
        return data.records
    } catch (error) {
        console.log(error);
    }
}


async function getFilms() {
    try {
        const res = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableId}?view=${airtableTableFilmsViewId}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`,
            },
            cache: 'no-store'
        });
        const data = await res.json();
        return data
    } catch (error) {
        console.log(error);
    }
}

async function getOthers() {
    try {
        const res = await fetch(`https://api.airtable.com/v0/${airtableBaseId}/${airtableTableOthersId}?view=${airtableTableOthersViewId}`, {
            headers: {
                Authorization: `Bearer ${airtableApiKey}`,
            },
            cache: 'no-store'
        });
        const data = await res.json();
        return data.records
    } catch (error) {
        console.log(error);
    }
}

export default async function Page() {
    let films = await getFilms()
    const filmEvents = await getFilmEvents()
    for (let film of films.records) {
        const filmId = film.id
        film.fields['Events'] = filmEvents.filter(event => event.fields.Film[0] === filmId)
    }
    //console.log('film 0', films.records[0])
    const others = await getOthers()
    const marquee = others.filter(data => data.fields['Type'] === 'Donate-Float').map(marquee => marquee.fields[`Title_${'en'}`]).join('');
    const sponsors = others.filter(data => data.fields['Type'] === 'Sponsor').map(sponsor => {
        sponsor.fields['Img'] = sponsor.fields['Img'] ? sponsor.fields['Img'].replace(/&dl=0(?!.*&dl=0)/, "&raw=1") : 'hi'
        return sponsor
    })
    const questions = others.filter(data => data.fields['Type'] === 'Question')
    const websiteGlobal = others.filter(data => data.fields['Type'] === 'Website')[0]
    const heroText = websiteGlobal.fields[`Title_${'en'}`].split('\n')

    return (
        <Scaffold lang="en">
            {/* ALL Films */}

            <div className='w-full h-screen flex flex-col justify-center isolate'>
                <div className="navbar flex justify-center w-full font-special text-h2 py-10">
                    <Link href="/">EN</Link>/
                    <Link href="/de">DE</Link>/
                    <Link href="/tw">TW</Link>
                </div>

                <div className="py-10 mix">
                    {heroText.map(text => <h1 className='text-center text-h1 font-special'>{text}</h1>)}
                    <h1 className='text-center text-h1 font-special text-primary'>{websiteGlobal.fields[`Theme_${'en'}`]}</h1>
                </div>

                <div className='text-center text-h4 py-[5rem] flex gap-5 justify-center'>
                    <Link className="text-white bg-secondary py-3 px-5 rounded-full font-special font-medium" href="/">{sectionTitles['en'].watchTrailer}</Link>
                    <Link href="/" className='border-2 border-secondary py-3 px-5 rounded-full font-special font-medium'>{sectionTitles['en'].buyTicket}</Link>
                </div>

                <ResponsiveIframe />
            </div>

            <Marquee content={marquee} link={"/"}></Marquee>


            <section className="max-w-1440 mx-auto px-[5vw]">

                <div className="flex flex-col gap-10">
                    <div className="flex justify-between items-center w-full font-special text-h1">
                        <h2 className="font-special text-black text-center">{websiteGlobal.fields['Year']}</h2>
                        <h2 className="font-special text-primary text-center">{sectionTitles['en'].filmSectionTitle}</h2>
                        <h2 className="font-special text-black text-center">TFFB</h2>
                    </div>
                    <div className="mx-auto my-10 max-w-[200px]">
                        <img src="img/hero2Img.png" className='block w-full'></img>
                    </div>
                </div>

                {films.records.map(film =>
                    !isEmpty(film.fields) && <Film
                        key={film.id}
                        id={film.id}
                        language={'en'}
                        film={film.fields}
                    >
                    </Film>
                )}

                {/* ALL Events  */}
                <SectionTitle content={sectionTitles['en'].eventSectionTitle}></SectionTitle>
                <Events language={'en'} />

                {/* ALL Sponsors  */}
                <SectionTitle content={sectionTitles['en'].sponsorSectionTitle}></SectionTitle>
                <Sponsors language={'en'} sponsors={sponsors} />

                <SectionTitle content={sectionTitles['en'].questionSectionTitle}></SectionTitle>
                <Questions language={'en'} questions={questions} />

                <div className="w-full flex flex-col gap-10 items-center my-[10rem]">
                    <div className="w-[200px]">
                        <img src="https://www.dropbox.com/scl/fi/qn9ac4ua1gtrplvbhh27h/IMTW_LOGO_-05.png?rlkey=j0ky1zca3mg4tdmfp9mawb92v&raw=1" />
                    </div>
                    <div>
                        <O href=""><button className="border-2 border-secondary py-3 px-5 rounded-full text-h4 font-special font-medium">{sectionTitles['en'].aboutUs}</button>
                        </O>
                    </div>
                    <div className="flex gap-5">
                        <SocialHandle logo="img/social_fb.png" link="https://www.facebook.com/ImpressionTaiwan/" />
                        <SocialHandle logo="img/social_ig.png" link="https://www.instagram.com/impressiontaiwan/" />
                    </div>
                </div>
            </section>

        </Scaffold>
    )
}