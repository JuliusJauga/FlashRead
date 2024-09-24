import { postTaskText } from "../components/axios";
import { questionProps } from "./questionPoints";

export function getTask1Data(setter: React.Dispatch<React.SetStateAction<questionProps>>) {
    const mode1Text = document.querySelector(".mode1_text") as HTMLParagraphElement;

    postTaskText().then((data) => {
        mode1Text.textContent = data.text;
        setter({questions: data.questions});
      });
}