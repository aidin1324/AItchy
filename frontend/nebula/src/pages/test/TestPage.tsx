import React from "react";
import EmotionComponent from "../../components/test/EmotionComponent";
import ContextFactorComponent from "../../components/test/ContextFactorComponent";
import EffectComponent from "../../components/test/EffectComponents";

type Props = {};

const TestPage = (props: Props) => {
  return (
    <>
      <EmotionComponent />
      <ContextFactorComponent />
      <EffectComponent/>
    </>
  );
};

export default TestPage;
