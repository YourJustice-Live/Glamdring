/**
 * Function that returns rule object.
 */
export default function Rule(
  id,
  ruleAbout,
  ruleAffected,
  ruleNegation,
  ruleUri,
  ruleUriData,
  ruleEffectsEnvironmental,
  ruleEffectsProfessional,
  ruleEffectsSocial,
  ruleEffectsPersonal,
  confirmationRuling,
  confirmationEvidence,
  confirmationWitness,
) {
  return {
    id: id,
    rule: {
      about: ruleAbout,
      affected: ruleAffected,
      negation: ruleNegation,
      uri: ruleUri,
      uriData: ruleUriData,
      effects: {
        environmental: ruleEffectsEnvironmental,
        professional: ruleEffectsProfessional,
        social: ruleEffectsSocial,
        personal: ruleEffectsPersonal,
      },
    },
    confirmation: {
      ruling: confirmationRuling,
      evidence: confirmationEvidence,
      witness: confirmationWitness,
    },
  };
}
