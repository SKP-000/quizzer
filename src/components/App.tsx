import React, { useEffect } from 'react';
import { Routes } from './Routes';
import styled from 'styled-components';
import { animated, useSpring } from 'react-spring';
import { useDispatch, useSelector } from 'react-redux';
import { setPresetId } from '../actions';
import { RootState } from '../types';

const Background = styled(animated.div)`
	--primary-rgb-color: 38, 188, 99; /* rgb version of our primary green color */
	--secondary-rgb-color: 242, 243, 229;
	--amethyst-rgb-color: 101, 0, 246;
	--grey-rgb-color: 46, 46, 46;
	height: 100vh;
`;

export const App: React.FC = () => {
	const dispatch = useDispatch();
	// using both location.pathname and the started boolean in order to determine if we should flip the background. maybe there's a better solution?
	const { location } = useSelector((state: RootState) => state.router);
	const started = useSelector((state: RootState) => state.quiz.started);
	const quizPresets = useSelector((state: RootState) => state.quiz.presets);

	useEffect(() => {
		quizPresets[0] && dispatch(setPresetId(quizPresets[0].id));
	}, [dispatch, quizPresets]);

	const getBG = () => {
		switch (true) {
			case location.pathname.includes('/start/q/') && started:
				return 'linear-gradient(180deg, #2ac46a 0%, #2ac46a 50%, #fcfcf3 50%)';
			case location.pathname.includes('/configure'):
				return 'linear-gradient(90deg, #2ac46a 0%, #2ac46a 30%, #fcfcf3 30%)';
			default:
				return 'linear-gradient(120deg, #2ac46a 0%, #2ac46a 50%, #fcfcf3 50%)';
		}
	};

	// animates when the Question component renders
	const animProps = useSpring({
		from: {
			backgroundImage:
				'linear-gradient(120deg, #2ac46a 0%, #2ac46a 50%, #fcfcf3 50%)'
		},
		to: {
			backgroundImage: getBG()
		}
	});

	return (
		<Background style={animProps}>
			<Routes />
		</Background>
	);
};
