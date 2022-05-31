
import React from 'react'
import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { Avatar ,Tag, TagLabel,} from '@chakra-ui/react';

function UserBadgeItem({user , handleFunction}) {
  return (
    <Tag 
      px={2}
      py={1}
      borderRadius="lg"
      size='lg'
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      colorScheme="purple"
      cursor="pointer"
      onClick={handleFunction}
    >
     
      <Avatar
      src={user.pic.url}
      size='xs'
      name= "Segun Adebayo"
      ml={-1}
      mr={2}
    />
    <TagLabel>{user.name}</TagLabel>
      <CloseIcon pl={1}/>
    </Tag>
  )
}

export default UserBadgeItem