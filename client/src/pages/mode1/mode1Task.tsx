import axios from '../../components/axiosWrapper';
import { question } from './questionPoints';

export type Task1Request = {
  taskId: number;
  theme: string;      // Any, History, Technology, Anime, Politics
  difficulty: string; // Any, Easy, Medium, Hard, Extreme
};
type Task1Response = {
  session: number;
  text: string;
  questions: question[];
};
type Task1AnswerRequest = {
  session: number;
  selectedVariants: number[];
};
type Task1AnswerStatistics = {
  correct: number;
  total: number;
};
type Task1AnswerResponse = {
  answers: question[];
  stats: Task1AnswerStatistics;
};

export type Mode1TaskData = {
  session: number;
  text: string;
  questions?: question[];
  answers?: question[];
  stats?: Task1AnswerStatistics;
};

const requestTask1Data = async (request: Task1Request) => {
  try {
    const axiosResponse = await axios.post('/api/GetTask', request);
    const response = axiosResponse.data as Task1Response;
    return {
      session: response.session,
      text: response.text,
      questions: response.questions,
    } as Mode1TaskData;
  } catch (err) {
    console.error('Error posting task text:', err);
    return { session: 0, text: 'Error retrieving task data'} as Mode1TaskData;
  }
};
const submitTask1Answers = async (request: Task1AnswerRequest) => {
  try {
    const axiosResponse = await axios.post('/api/GetTaskAnswer', request);
    const response = axiosResponse.data as Task1AnswerResponse;
    return {
      session: 0,
      text: "",
      answers: response.answers,
      stats: response.stats,
    } as Mode1TaskData;
  } catch (err) {
    console.error('Error posting task text:', err);
    return { session: 0, text: 'Error retrieving task answers'} as Mode1TaskData;
  }

};

export { requestTask1Data, submitTask1Answers };