interface Tag {
  display: string;
  uuid: string;
}

export const getFlagType = (tags: Array<Tag>) => {
  const flagTypeKind = tags.find((tag) => ['risk', 'info', 'no risk'].includes(tag.display.toLowerCase()));
  // const type = flagTypeKind?.display?.split('-')[1];
  // return type;
  return flagTypeKind.display;
};
