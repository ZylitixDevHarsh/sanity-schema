import { defineArrayMember, defineField, defineType } from 'sanity'
import { BookIcon } from '@sanity/icons/Book'

export const course = defineType({
  name: 'course',
  title: 'Course',
  type: 'document',
  icon: BookIcon,
  groups: [
    { name: 'catalogue', title: 'Catalogue', default: true },
    { name: 'curriculum', title: 'Curriculum' },
    { name: 'search', title: 'Search & SEO' },
  ],
  fields: [
    // ---- Catalogue (list page) ----
    defineField({
      name: 'title',
      type: 'string',
      group: 'catalogue',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'catalogue',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short description',
      description: 'Shown on catalogue cards and in search results.',
      type: 'text',
      rows: 3,
      group: 'catalogue',
      validation: (r) => r.required().max(240),
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      group: 'catalogue',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (r) => r.required(),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{ type: 'category' }],
      group: 'catalogue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'level',
      type: 'string',
      group: 'catalogue',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
      initialValue: 'beginner',
    }),
    defineField({
      name: 'instructorName',
      title: 'Instructor name',
      type: 'string',
      group: 'catalogue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'instructorAvatar',
      title: 'Instructor avatar',
      description: 'Small square photo shown next to the instructor name.',
      type: 'image',
      group: 'catalogue',
      options: { hotspot: true },
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      group: 'catalogue',
      initialValue: false,
    }),

    // ---- Details page ----
    defineField({
      name: 'description',
      title: 'Full description',
      description: 'Shown on the course details page.',
      type: 'array',
      group: 'catalogue',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'learningOutcomes',
      title: "What you'll learn",
      type: 'array',
      group: 'catalogue',
      of: [{ type: 'string' }],
    }),

    // ---- Curriculum (modules -> lessons) ----
    defineField({
      name: 'modules',
      type: 'array',
      group: 'curriculum',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'module',
          title: 'Module',
          fields: [
            defineField({
              name: 'title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'lessons',
              type: 'array',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'lesson' }] })],
              validation: (r) => r.required().min(1),
            }),
          ],
          preview: {
            select: { title: 'title', lessons: 'lessons' },
            prepare: ({ title, lessons }) => ({
              title,
              subtitle: `${lessons?.length ?? 0} lessons`,
            }),
          },
        }),
      ],
    }),

    // ---- Search (Algolia) ----
    defineField({
      name: 'keywords',
      description: 'Extra search terms indexed by Algolia (e.g. "react", "hooks").',
      type: 'array',
      group: 'search',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'instructorName', media: 'image' },
  },
  orderings: [
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
