import { Column, Heading, Icon, Row, Text } from "@once-ui-system/core";
import { VisitorAvatar } from "@/components/VisitorAvatar";
import { PrivyWaitlist } from "@/components/PrivyWaitlist";

export const metadata = {
  title: "Dashboard | RokitG Academy",
  description: "A focused learning space for beginner traders.",
};

const modules = [
  {
    title: "Trading foundations",
    description:
      "Build the habits and vocabulary that keep beginners grounded.",
    status: "Starting soon",
    icon: "book" as const,
  },
  {
    title: "Risk before reward",
    description:
      "Learn how to protect your account before searching for the next setup.",
    status: "Member module",
    icon: "grid" as const,
  },
  {
    title: "Your trading process",
    description: "Turn ideas into a repeatable plan you can actually follow.",
    status: "Member module",
    icon: "person" as const,
  },
];

export default function AppPreviewPage() {
  return (
    <Column maxWidth="m" fillWidth gap="xl" paddingY="12" horizontal="center">
      <Column maxWidth="s" horizontal="center" align="center" gap="m">
        <Heading wrap="balance" variant="display-strong-l">
          Your next chapter.
        </Heading>
        <Text
          wrap="balance"
          onBackground="neutral-weak"
          variant="heading-default-xl"
        >
          A focused learning space for beginner traders who want a process
          before they chase results.
        </Text>
      </Column>

      <Column
        maxWidth="s"
        fillWidth
        style={{ maxWidth: "36rem" }}
        background="surface"
        border="neutral-alpha-medium"
        radius="l"
        padding="32"
        gap="24"
      >
        <Row gap="12" vertical="center">
          <Row background="brand-alpha-weak" radius="m" padding="8">
            <VisitorAvatar />
          </Row>
          <Column gap="4">
            <Heading as="h2" variant="heading-strong-l">
              Your learning space
            </Heading>
            <Text onBackground="neutral-weak" variant="body-default-s">
              RokitG · Social Capital
            </Text>
          </Column>
        </Row>
        <Text onBackground="neutral-weak" variant="body-default-m">
          Lessons, resources, and a clear path forward. All in one place.
        </Text>
        <Row borderTop="neutral-alpha-weak" paddingTop="16">
          <PrivyWaitlist />
        </Row>
      </Column>

      <Column maxWidth="m" fillWidth gap="s">
        {modules.map((module, index) => (
          <Row
            key={module.title}
            fillWidth
            background="surface"
            border="neutral-alpha-weak"
            radius="l"
            padding="l"
            gap="m"
            vertical="center"
            horizontal="between"
          >
            <Row gap="m" vertical="center">
              <Icon
                name={module.icon}
                onBackground={index === 0 ? "brand-strong" : "neutral-weak"}
              />
              <Column gap="4">
                <Text variant="heading-strong-m">{module.title}</Text>
                <Text onBackground="neutral-weak" variant="body-default-s">
                  {module.description}
                </Text>
              </Column>
            </Row>
            <Text onBackground="neutral-weak" variant="label-default-s">
              {module.status}
            </Text>
          </Row>
        ))}
      </Column>

      <Text align="center" onBackground="neutral-weak" variant="body-default-s">
        The member area is opening in batches.
      </Text>
    </Column>
  );
}
