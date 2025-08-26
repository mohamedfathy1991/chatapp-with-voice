import {
  Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalFooter, ModalHeader, ModalOverlay, Button, Avatar, Text
} from "@chakra-ui/react";

export function Profilemodal({ isOpen, onClose, user }) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>My Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Avatar size="xl" src={user.pic} name={user.name} mb={4} />
          <Text fontSize="lg">{user.name}</Text>
          <Text fontSize="sm" color="gray.500">{user.email}</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
