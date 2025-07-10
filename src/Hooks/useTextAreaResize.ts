import { useEffect } from "react";

export const useTextAreaResize = (ref: React.RefObject<HTMLTextAreaElement | null>, value: string) => {
	useEffect(() => {
		if(!ref.current) return;
		const Area = ref.current;

		Area.style.height = "auto";

		if (Area.scrollHeight > Area.clientHeight){
			Area.style.height = `${Area.scrollHeight}px`;
		}
	}, [ref, value]);
};