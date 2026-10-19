import { groq } from 'next-sanity'

// Catalogue page
export const COURSE_LIST_QUERY = groq`
  *[_type == "course" && defined(slug.current)] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    image,
    level,
    "category": category->{title, "slug": slug.current}
  }
`

// Course details page (lesson _id values are what PostgreSQL stores for progress)
export const COURSE_DETAIL_QUERY = groq`
  *[_type == "course" && slug.current == $slug][0] {
    _id,
    title,
    shortDescription,
    description,
    learningOutcomes,
    image,
    level,
    "category": category->{title, "slug": slug.current}, modules[] { title,
      "lessons": lessons[]->{
        _id,
        title,
        "slug": slug.current,
        type,
        durationMinutes
      }
    }
  }
`

// Used to compute progress % = completed lessons / total lessons
export const COURSE_LESSON_IDS_QUERY = groq`
  *[_type == "course" && _id == $courseId][0].modules[].lessons[]._ref
`

// Record shape to push to Algolia (use in a Sanity webhook / Next.js route handler)
export const ALGOLIA_RECORD_QUERY = groq`
  *[_type == "course" && _id == $id][0] {
    "objectID": _id,
    title,
    "slug": slug.current,
    shortDescription,
    keywords,
    level,
    "category": category->title,
    "imageUrl": image.asset->url
  }
`
