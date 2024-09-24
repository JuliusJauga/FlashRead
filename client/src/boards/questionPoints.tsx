import BulletPoints from "../components/bulletPoint";

export interface question {
    question: string;
    variants: string[];
}

export type questionProps = {
    questions: question[];
}


const QuestionPoints: React.FC<questionProps> = ({ questions }) => {

    const getQuestions = (data: question[]) => {
        if (data === undefined || data.length === 0) {
            return <h1>There are no questions</h1>;
        }
        return data.map((question, index) => {
            return (
                <div className="mode1_questionDiv" id={`mode1_question${index + 1}Div`}>
                    <h1 className="mode1_question">{question.question}</h1>
                    <BulletPoints choices={question.variants} />
                </div>
            );
        });

    }

    return getQuestions(questions);
}

export default QuestionPoints;