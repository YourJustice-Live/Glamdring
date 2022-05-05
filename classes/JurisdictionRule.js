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
    confirmationRuling,
    confirmationEvidence,
    confirmationWitness,
    effects,
  ) {
    this.id = id;
    this.ruleId = ruleId;
    this.rule = {
      about: ruleAbout,
      affected: ruleAffected,
      negation: ruleNegation,
      uri: ruleUri,
      uriData: ruleUriData,
    };
    this.confirmation = {
      ruling: confirmationRuling,
      evidence: confirmationEvidence,
      witness: confirmationWitness,
    };
    this.effects = effects;
  }
}
