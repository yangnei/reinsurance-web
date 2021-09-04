export function gross_premium(sum_insured, premium_rate, rate_corrected_factor) {
  return sum_insured * (premium_rate / 100.0) * (rate_corrected_factor / 100.0)
}

export function premium_without_tax(gross_premium, overseas) {
  return gross_premium / (1 + vat(overseas))
}

function vat(overseas) {
  return overseas ? 0.072 : 0.06
}

export function value_added_tax(gross_premium, premium_without_tax) {
  return gross_premium - premium_without_tax
}

export function amount_insured(sum_insured, max_unit_pml) {
  return max_unit_pml ? max_unit_pml : sum_insured
}

export function max_acceptable_ratio(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  switch (contract.type) {
    case 0:
      return max_acceptable_ratio_without_contract(insured_amount, max_approval_amount, split_ratio)
    case 1:
      return max_acceptable_ratio_with_qs(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio)
    case 2:
      return max_acceptable_ratio_with_surplus(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio, sa_lines)
    case 3:
      return max_acceptable_ratio_with_combined(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio, sa_lines)
    case 4:
      return max_acceptable_ratio_with_eol_per_risk(contract, insured_amount, max_approval_amount, split_ratio)
    case 5:
      return max_acceptable_ratio_with_eol_ratio(contract, insured_amount, max_approval_amount, split_ratio)
    default:

      return .0
  }
}

function max_acceptable_ratio_without_contract(insured_amount, max_approval_amount, split_ratio) {
  const ratio = max_approval_amount / (insured_amount * (1 - split_ratio / 100.0)) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

function max_acceptable_ratio_with_qs(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio) {
  let ratio
  if (sa_ratio)
    ratio = (max_approval_amount - sa_ratio / 100.0 * risk_discount_ratio / 100.0 * (contract.retentionRatio / 100.0 - 1) * contract.cededMaxAmount) / (insured_amount * (1 - split_ratio / 100.0)) * 100.0
  else
    ratio = max_approval_amount / (risk_discount_ratio / 100.0 * (contract.retentionRatio / 100.0 - 1) * contract.cededMaxAmount + insured_amount * (1 - split_ratio / 100.0)) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

function max_acceptable_ratio_with_surplus(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  const lines = sa_lines ? sa_lines : contract.lines
  let ratio
  if (sa_ratio)
    ratio = (max_approval_amount + sa_ratio / 100.0 * lines * risk_discount_ratio / 100.0 * contract.retention) / (insured_amount * (1 - split_ratio / 100.0)) * 100.0
  else
    ratio = max_approval_amount / (insured_amount * (1 - split_ratio / 100.0) - lines * risk_discount_ratio / 100.0 * contract.retention) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

function max_acceptable_ratio_with_combined(contract, insured_amount, max_approval_amount, split_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  const lines = sa_lines ? sa_lines : contract.lines
  let ratio
  if (sa_ratio)
    ratio = (max_approval_amount - sa_ratio / 100.0 * risk_discount_ratio / 100.0 * (contract.retentionRatio / 100.0 - lines - 1) * contract.retention) / (insured_amount * (1 - split_ratio / 100.0)) * 100.0
  else
    ratio = max_approval_amount / (risk_discount_ratio / 100.0 * (contract.retentionRatio / 100.0 - lines - 1) * contract.retention + insured_amount * (1 - split_ratio / 100.0)) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

function max_acceptable_ratio_with_eol_per_risk(contract, insured_amount, max_approval_amount, split_ratio) {
  const ratio = (max_approval_amount - contract.retention + contract.cededMaxAmount) / (insured_amount * (1 - split_ratio / 100.0)) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

function max_acceptable_ratio_with_eol_ratio(contract, insured_amount, max_approval_amount, split_ratio) {
  const ratio = max_approval_amount / (insured_amount * (contract.retentionRatio / 100.0 - contract.cededMaxRatio / 100.0 + 1 - split_ratio / 100.0)) * 100.0
  return ratio <= 100.0 ? ratio : 100.0
}

export function max_acceptable_amount(insured_amount, acceptable_ratio) {
  return insured_amount * acceptable_ratio / 100.0
}

export function split_amount(acceptable_amount, split_ratio) {
  return acceptable_amount * split_ratio / 100.0
}

export function accepted_insured_amount(insured_amount, accepted_ratio) {
  return insured_amount * accepted_ratio / 100.0
}

export function split_amount_remaining(accepted_amount, split_ratio) {
  return accepted_amount * (1 - split_ratio / 100.0)
}

export function accepted_gross_premium(premium_inc_tax, gross_premium, premium_without_tax, accepted_ratio) {
  if (premium_inc_tax)
    return gross_premium * accepted_ratio / 100.0
  else
    return premium_without_tax * accepted_ratio / 100.0
}

export function accepted_premium_without_tax(premium_inc_tax, overseas, gross_premium, premium_without_tax, accepted_ratio) {
  if (premium_inc_tax)
    return gross_premium / (1 + vat(overseas)) * accepted_ratio / 100.0
  else
    return premium_without_tax * accepted_ratio / 100.0
}

export function accepted_premium_tax(gross_premium, premium_without_tax) {
  return gross_premium - premium_without_tax
}

export function accepted_commission(premium_inc_tax, gross_premium, premium_without_tax, commission_ratio) {
  if (premium_inc_tax)
    return premium_without_tax * commission_ratio / 100.0
  else
    return gross_premium * accepted_ratio / 100.0
}

export function accepted_brokerage(brokerage_inc_tax, accepted_amount, accepted_premium_without_tax, premium_ratio, brokerage_ratio) {
  if (brokerage_inc_tax)
    return accepted_amount * premium_ratio / 100.0 * brokerage_ratio / 100.0
  else
    return accepted_premium_without_tax * brokerage_ratio / 100.0
}

export function accepted_brokerage_tax(brokerage_inc_tax, overseas, accepted_gross_premium, brokerage_ratio) {
  if (brokerage_inc_tax)
    return 0
  else
    return accepted_gross_premium * brokerage_ratio / 100.0 * vat(overseas)
}

export function accepted_balance(accepted_gross_premium, accepted_commission, accepted_brokerage, accepted_brokerage_tax) {
  return accepted_gross_premium - accepted_commission - accepted_brokerage - accepted_brokerage_tax
}

export function accepted_pml(insured_amount, split_ratio, accepted_ratio) {
  return insured_amount /* * (1 - split_ratio / 100.0) 如果和临分比例相关 */ * accepted_ratio / 100.0
}

export function accepted_addtional_retention(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  switch (contract.type) {
    case 1:
      return accepted_addtional_retention_with_qs(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio)
    case 2:
      return accepted_addtional_retention_with_surplus(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines)
    case 3:
      return accepted_addtional_retention_with_combined(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines)
    case 4:
      return accepted_addtional_retention_with_eol_per_risk(contract, accepted_pml)
    case 5:
      return accepted_addtional_retention_with_eol_ratio(contract, accepted_pml)
    default:

      return .0
  }
}

function accepted_addtional_retention_with_qs(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio) {
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.cededMaxAmount
  if (accepted_pml > treaty_retention)
    return accepted_pml - treaty_retention
  return .0
}

function accepted_addtional_retention_with_surplus(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  const lines = (sa_lines ? sa_lines : contract.lines) + 1
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const contract_capacity = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retention * lines
  if (accepted_pml > contract_capacity)
    return accepted_pml - contract_capacity
  return .0
}

function accepted_addtional_retention_with_combined(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  return accepted_addtional_retention_with_surplus(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines)
}

function accepted_addtional_retention_with_eol_per_risk(contract, accepted_pml) {
  if (accepted_pml > contract.cededMaxAmount)
    return accepted_pml - contract.cededMaxAmount
  return .0
}

function accepted_addtional_retention_with_eol_ratio(contract, accepted_pml) {
  if (contract.cededMaxRatio < 100) {
    return accepted_pml * (1 - contract.cededMaxRatio / 100.0)
  }
  return .0
}

export function surplus_share_amount(contract, accepted_pml, accepted_ratio, risk_discount_ratio, sa_ratio, sa_lines) {
  switch (contract.type) {
    case 2:
    case 3:
      const ratio = sa_ratio ? sa_ratio : accepted_ratio
      const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retention
      const lines = sa_lines ? sa_lines : contract.lines
      const contract_capacity = treaty_retention * (lines + 1)
      if (accepted_pml <= treaty_retention) {
        return .0
      } else if (accepted_pml >= contract_capacity) {
        return contract_capacity - treaty_retention
      } else {
        return accepted_pml - treaty_retention
      }
    default:

      return .0
  }
}

export function surplus_share_premium(surplus_share_amount, premium_ratio) {
  return surplus_share_amount * premium_ratio / 100.0
}

export function quota_ceded_amount(contract, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  let retention
  switch (contract.type) {
    case 1:
      retention = contract.cededMaxAmount
      break
    case 3:
      retention = contract.retention
      break
    default:

      return .0
  }
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const quota_capacity = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retentionRatio / 100.0 * retention
  const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * retention

  if (split_amount_remaining <= quota_capacity) {
    return .0
  } else if (split_amount_remaining >= treaty_retention) {
    return treaty_retention - quota_capacity
  } else {
    return split_amount_remaining - quota_capacity
  }
}

export function quota_ceded_ratio(contract, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  let retention
  switch (contract.type) {
    case 1:
      retention = contract.cededMaxAmount
      break
    case 3:
      retention = contract.retention
      break
    default:

      return .0
  }
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const quota_capacity = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retentionRatio / 100.0 * retention
  const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * retention

  if (split_amount_remaining <= quota_capacity) {
    return .0
  } else if (split_amount_remaining >= treaty_retention) {
    return 100 - contract.retentionRatio
  } else {
    return (split_amount_remaining - quota_capacity) / treaty_retention * 100.0
  }
}

export function quota_ceded_premium(quota_ceded_amount, premium_ratio) {
  return quota_ceded_amount * premium_ratio / 100.0
}

export function quota_retention_amount(contract, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  let retention
  switch (contract.type) {
    case 1:
      retention = contract.cededMaxAmount
      break
    case 3:
      retention = contract.retention
      break
    default:

      return .0
  }
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const quota_capacity = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retentionRatio / 100.0 * retention

  if (split_amount_remaining >= quota_capacity) {
    return quota_capacity
  } else {
    return split_amount_remaining
  }
}

export function quota_retention_ratio(contract, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  let retention
  switch (contract.type) {
    case 1:
      retention = contract.cededMaxAmount
      break
    case 3:
      retention = contract.retention
      break
    default:

      return .0
  }
  const ratio = sa_ratio ? sa_ratio : accepted_ratio
  const quota_capacity = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retentionRatio / 100.0 * retention
  const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * retention

  if (split_amount_remaining >= quota_capacity) {
    return contract.retentionRatio
  } else {
    return split_amount_remaining / treaty_retention * 100.0
  }
}

export function quota_retention_premium(quota_retention_amount, premium_ratio) {
  return quota_retention_amount * premium_ratio / 100.0
}

export function treaty_amount(contract, quota_retention_amount, quota_ceded_amount, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  switch (contract.type) {
    case 1:
    case 3:
      return quota_retention_amount + quota_ceded_amount
    case 2:
      const ratio = sa_ratio ? sa_ratio : accepted_ratio
      const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retention
      if (split_amount_remaining <= treaty_retention) {
        return split_amount_remaining
      } else {
        return treaty_retention
      }
    case 4:
      if (split_amount_remaining <= contract.retention)
        return .0;
      else if (split_amount_remaining >= contract.cededMaxAmount)
        return contract.cededMaxAmount - contract.retention
      else
        return split_amount_remaining - contract.retention
    case 5:
      return split_amount_remaining * (1 - contract.retentionRatio / 100.0)
    default:

      return .0
  }
}

export function treaty_ratio(contract, quota_retention_ratio, quota_ceded_ratio, split_amount_remaining, accepted_ratio, risk_discount_ratio, sa_ratio) {
  switch (contract.type) {
    case 1:
    case 3:
      return quota_retention_ratio + quota_ceded_ratio
    case 2:
      const ratio = sa_ratio ? sa_ratio : accepted_ratio
      const treaty_retention = ratio / 100.0 * risk_discount_ratio / 100.0 * contract.retention
      if (split_amount_remaining <= treaty_retention) {
        return split_amount_remaining / treaty_retention * 100.0
      } else {
        return 100.0
      }
    default:

      return .0
  }
}

export function treaty_premium(contract, quota_ceded_premium, surplus_share_premium, treaty_amount, premium_ratio) {
  switch (contract.type) {
    case 1:
    case 2:
    case 3:
      return quota_ceded_premium + surplus_share_premium
    case 4:
    case 5:
      return treaty_amount * premium_ratio / 100.0
    default:

      return .0
  }
}

export function net_retention(contract, addtional_retention, quota_retention_amount, split_amount_remaining, treaty_amount) {
  switch (contract.type) {
    case 1:
    case 2:
    case 3:
      return addtional_retention + quota_retention_amount
    case 4:
    case 5:
      return split_amount_remaining >= treaty_amount ? split_amount_remaining - treaty_amount : .0
    default:

      return .0
  }
}

export function net_premium() {

}

export function retro_ratio() {

}
