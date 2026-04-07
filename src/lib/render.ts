/**
 * Safely render conditional JSX from unknown values.
 * Use this instead of `value && <JSX />` when `value` might be `unknown`.
 */
export function when<T>(
  condition: T,
  render: (val: NonNullable<T>) => React.ReactNode,
): React.ReactNode {
  if (condition == null) return null;
  return render(condition as NonNullable<T>);
}
