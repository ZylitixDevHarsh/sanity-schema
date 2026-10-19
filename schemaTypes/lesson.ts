import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons/Play'

// Lessons are standalone documents so their _id is a stable key
// that PostgreSQL can reference in the lesson_progress table.
export const lesson = defineType({
  name: 'lesson',
  title: 'Lesson',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'type',
      title: 'Lesson type',
      type: 'string',
      options: {
        list: [
          { title: 'Video', value: 'video' },
          { title: 'Article', value: 'article' },
        ],
        layout: 'radio',
      },
      initialValue: 'article',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      hidden: ({ parent }) => parent?.type !== 'video',
      validation: (r) =>
        r.custom((value, ctx) =>
          (ctx.parent as { type?: string })?.type === 'video' && !value
            ? 'Video URL is required for video lessons'
            : true,
        ),
    }),
    defineField({
      name: 'durationMinutes',
      title: 'Duration (minutes)',
      type: 'number',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: 'content',
      title: 'Lesson content',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] },
        { type: 'code' }, // requires @sanity/code-input plugin (optional)
      ],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'type' } },
})
