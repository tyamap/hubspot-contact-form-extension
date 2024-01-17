type Property = {
  id: string
  calculated: boolean
  description: string
  displayOrder: number
  externalOptions: boolean
  fieldType: string
  formField: boolean
  groupName: string
  hasUniqueValue: boolean
  hidden: boolean
  hubspotDefined: boolean
  label: string
  archivable: boolean
  readOnlyDefinition: boolean
  readOnlyValue: boolean
  name: string
  type: string
  modificationMetadata: {
    archivable: boolean
    readOnlyDefinition: boolean
    readOnlyValue: boolean
  }
  options: {
    description: string
    displayOrder: number
    hidden: boolean
    label: string
    value: string
  }[]
  createdAt: string
  updatedAt: string
}