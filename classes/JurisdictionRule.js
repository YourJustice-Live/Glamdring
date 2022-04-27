/**
 * Class for the jurisdiction rule.
 */
export default class JurisdictionRule {
  constructor(
    id,
    ruleId,
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
    this.id = id;
    this.ruleId = ruleId;
    this.rule = {
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
    };
    this.confirmation = {
      ruling: confirmationRuling,
      evidence: confirmationEvidence,
      witness: confirmationWitness,
    };
  }
}