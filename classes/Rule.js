/**
 * Class for the rule.
 */
export default class Rule {
  constructor(
    id,
    ruleAbout,
    ruleAffected,
    ruleNegation,
    ruleUri,
    ruleEffectsEnvironmental,
    ruleEffectsProfessional,
    ruleEffectsSocial,
    ruleEffectsPersonal,
    confirmationRuling,
    confirmationEvidence,
    confirmationWitness,
  ) {
    this.id = id;
    this.rule = {
      about: ruleAbout,
      affected: ruleAffected,
      negation: ruleNegation,
      uri: ruleUri,
      effects: {
        environmental: ruleEffectsEnvironmental,
        professional: ruleEffectsProfessional,
        social: ruleEffectsSocial,
        personal: ruleEffectsPersonal,
      },
    };
    this.confirmation = {
      ruling: confirmationRuling,
      evidence: confirmationEvidence,
      witness: confirmationWitness,
    };
  }
}
