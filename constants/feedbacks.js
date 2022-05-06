import { EMAIL } from 'constants/contacts';

export const FORM = {
  // Post Feedback
  postFeedback: {
    type: 'post_feedback',
    recepients: [EMAIL.dev, EMAIL.product],
    title: 'Post Feedback',
    description:
      'Do you have ideas how to improve the app? Maybe you have questions? Post feedback.',
    schema: {
      type: 'object',
      required: ['feedback'],
      properties: {
        feedback: {
          type: 'string',
          title: 'Your Feedback',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      feedback: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
  // Ask Question
  askQuestion: {
    type: 'ask_question',
    recepients: [EMAIL.dev, EMAIL.product],
    title: 'Ask Question',
    description: 'What question do you have?',
    schema: {
      type: 'object',
      required: ['question'],
      properties: {
        question: {
          type: 'string',
          title: 'Your Question',
        },
        contact: {
          type: 'string',
          title: 'Your Email, Twitter, Telegram, etc',
        },
      },
    },
    uiSchema: {
      question: {
        'ui:widget': 'textarea',
        'ui:options': {
          rows: 5,
        },
      },
    },
  },
  // Propose Law
  proposeLaw: {
    type: 'propose_law',
    recepients: [EMAIL.dev],
  },
  // Comment Law
  commentLaw: {
    type: 'comment_law',
    recepients: [EMAIL.dev],
  },
};
