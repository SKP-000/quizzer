import React, { useEffect } from 'react';
import styled from 'styled-components';
import { animated, useSpring, useTransition } from 'react-spring';
import { useViewElement, useCurrentRoute } from 'react-navi';
import { useDispatch, useSelector } from 'react-redux';
import { setPresetId } from '../actions';
import { RootState } from '../types';

const Background = styled(animated.div)`
  --primary-rgb-color: 38, 188, 99;
  --secondary-rgb-color: 242, 243, 229;
  --amethyst-rgb-color: 101, 0, 246;
  --grey-rgb-color: 46, 46, 46;
  --teal-rgb-color: 26, 172, 172;
  height: 100vh;
`;

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const route = useCurrentRoute();
  // using both location.pathname and the started boolean in order to determine if we should flip the background. maybe there's a better solution?
  const location = route.url;
  const started = useSelector((state: RootState) => state.quiz.started);
  const quizPresets = useSelector((state: RootState) => state.quiz.presets);
  const questions = useSelector((state: RootState) => state.quiz.questions);
  const players = useSelector((state: RootState) => state.scoreboard.players);

  const viewElement = useViewElement();
  const transitions = useTransition(viewElement, route.url.href, {
    from: { transform: 'translate3d(100%,0,0)' },
    enter: { transform: 'translate3d(0%,0,0)' },
    leave: { opacity: 0, transform: 'translate3d(-100%,0,0)' }
  });

  useEffect(() => {
    quizPresets[0] && dispatch(setPresetId(quizPresets[0].id));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    questions.map((q, i) => {
      // NOTE: THIS CODE BREAKS IF NUMBER OF PLAYERS EXCEEDS 4.
      const prevQuestion = questions[i - 1];
      let playerI: number = 0;
      if (prevQuestion) playerI = players.indexOf(questions[i - 1].player);
      const numOfIndices = players.length - 1;
      // we're brute handling all edge cases here. maybe try implementing a better solution?
      if (!prevQuestion) {
        q.player = players[0];
      } else if (numOfIndices - playerI === 1) {
        q.player = players[numOfIndices];
      } else if (playerI === 0) {
        q.player = players[playerI + 1];
      } else {
        q.player = players[numOfIndices - playerI];
      }

      if (players.length === 1) q.player = players[0];

      return {
        ...q
      };
    });
  }, [dispatch, questions, players]);

  useEffect(() => {
    window.localStorage.setItem('quizPresets', JSON.stringify(quizPresets));
  }, [quizPresets]);

  const getBG = () => {
    switch (true) {
      case location.pathname.includes('/start/q/') && started:
        return 'linear-gradient(180deg, #2ac46a 0%, #2ac46a 50%, #fcfcf3 50%)';
      case location.pathname.includes('/configure') ||
        location.pathname.includes('/log') ||
        location.pathname.includes('/create') ||
        location.pathname.includes('/scoreboard'):
        return `linear-gradient(90deg, #2ac46a 0%, #2ac46a 30%, #fcfcf3 30%)`;
      case location.pathname.includes('/playerturn'):
        return `linear-gradient(90deg, #6e00fe 0%, #6e00fe 50%, #6e00fe 50%)`;
      case location.pathname.includes('/finalresults'):
        return `linear-gradient(90deg, #2ac46a 0%, #2ac46a 50%, #2ac46a 50%)`;
      default:
        return `linear-gradient(110deg, #2ac46a 0%, #2ac46a 50%, #fcfcf3 50%)`;
    }
  };

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
      {transitions.map(({ item, key, props }) => (
        <animated.div
          key={key}
          style={{
            ...props,
            position: 'absolute',
            top: 0,
            width: '100%'
          }}
        >
          {item}
        </animated.div>
      ))}
    </Background>
  );
};
