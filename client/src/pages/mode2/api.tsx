import axios from '../../components/axiosWrapper';

export type Task2Request = {
    taskId: number; 
    wordArray : string[];
    collectedWord : string;
    collision: boolean;
    currentCombo?: number;
    currentPoints?: number;
};
export type Task2DBRequest = {
    taskId: number;
    theme: string;
};
type Task2Response = {
    session: number;
    points: number;
    combo: number;
};
type Task2DataResponse = {
    session: number;
    wordArray: string[];
}
export type Mode2TaskData = {
    points: number;
    combo: number;
};
type Mode2WordData = {
    wordArray : string[];
}

const requestTask2Data = async (request: Task2DBRequest) => {
    try {
      const axiosResponse = await axios.post('/api/GetTask', request);
      const response = axiosResponse.data as Task2DataResponse;
      return {
        wordArray: response.wordArray
      } as Mode2WordData;
    } catch (err) {
      console.error('Error posting task text:', err);
      return { wordArray : {} } as Mode2WordData;
    }
};

const requestTask2Points = async (request: Task2Request) => {
    try {
      const axiosResponse = await axios.post('/api/GetTask', request);
      const response = axiosResponse.data as Task2Response;
      return {
        points: response.points,
        combo: response.combo
      } as Mode2TaskData;
    } catch (err) {
      console.error('Error posting task text:', err);
      return { points: 0, combo: 0 } as Mode2TaskData;
    }
};

export { requestTask2Points, requestTask2Data };