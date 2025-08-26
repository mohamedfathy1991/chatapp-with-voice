import { HStack, Skeleton, SkeletonCircle, Stack } from "@chakra-ui/react"

export default function ChatLoading ({data}) {
  return (
    <>
    <HStack gap="5" mt={'3'}>
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
    <HStack gap="5" mt={'3'}>
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
    <HStack gap="5" mt={'3'}>
      <SkeletonCircle size="12" />
      <Stack flex="1">
        <Skeleton height="5" />
        <Skeleton height="5" width="80%" />
      </Stack>
    </HStack>
    </>
  )
}
