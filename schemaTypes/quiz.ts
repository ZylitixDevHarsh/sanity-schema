import { defineArrayMember, defineField, defineType } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons/HelpCircle'

export const quiz = defineType({
  name: 'quiz',
  title: 'Quiz',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'questions', title: 'Questions' },
  ],
  fields: [
    // ---- Details ----
    defineField({
      name: 'title',
      type: 'string',
      group: 'details',
      validation: (r) => r.required().max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Short intro shown before the learner starts the quiz.',
      type: 'text',
      rows: 3,
      group: 'details',
      validation: (r) => r.max(240),
    }),
    defineField({
      name: 'passingScore',
      title: 'Passing score (%)',
      description: 'Minimum percentage required to pass.',
      type: 'number',
      group: 'details',
      initialValue: 70,
      validation: (r) => r.required().min(0).max(100).integer(),
    }),
    defineField({
      name: 'timeLimitMinutes',
      title: 'Time limit (minutes)',
      description: 'Leave empty for no time limit.',
      type: 'number',
      group: 'details',
      validation: (r) => r.min(1).integer(),
    }),
    defineField({
      name: 'shuffleQuestions',
      title: 'Shuffle questions',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'allowRetake',
      title: 'Allow retakes',
      type: 'boolean',
      group: 'details',
      initialValue: true,
    }),

    // ---- Questions ----
    defineField({
      name: 'questions',
      type: 'array',
      group: 'questions',
      validation: (r) => r.required().min(1),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'question',
          title: 'Question',
          fields: [
            defineField({
              name: 'prompt',
              title: 'Question',
              type: 'text',
              rows: 2,
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'questionType',
              title: 'Question type',
              type: 'string',
              options: {
                layout: 'radio',
                list: [
                  { title: 'Single choice', value: 'single' },
                  { title: 'Multiple choice', value: 'multiple' },
                ],
              },
              initialValue: 'single',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'options',
              title: 'Answer options',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'option',
                  title: 'Option',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Answer text',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'isCorrect',
                      title: 'Correct answer',
                      type: 'boolean',
                      initialValue: false,
                    }),
                  ],
                  preview: {
                    select: { title: 'text', isCorrect: 'isCorrect' },
                    prepare: ({ title, isCorrect }) => ({
                      title,
                      subtitle: isCorrect ? '✓ Correct' : undefined,
                    }),
                  },
                }),
              ],
              validation: (r) =>
                r.required().min(2).custom((options, context) => {
                  const parent = context.parent as { questionType?: string } | undefined
                  const correct = (options as { isCorrect?: boolean }[] | undefined)?.filter(
                    (o) => o?.isCorrect,
                  ).length ?? 0

                  if (correct === 0) return 'Mark at least one option as correct.'
                  if (parent?.questionType !== 'multiple' && correct > 1) {
                    return 'Single choice questions can only have one correct answer.'
                  }
                  return true
                }),
            }),
            defineField({
              name: 'explanation',
              title: 'Explanation',
              description: 'Shown after the learner answers (optional).',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: { title: 'prompt', options: 'options' },
            prepare: ({ title, options }) => ({
              title,
              subtitle: `${options?.length ?? 0} options`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', questions: 'questions' },
    prepare: ({ title, questions }) => ({
      title,
      subtitle: `${questions?.length ?? 0} questions`,
    }),
  },
  orderings: [
    {
      title: 'Title A–Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
