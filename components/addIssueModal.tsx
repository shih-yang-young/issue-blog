import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { Octokit } from "octokit";
import { toast } from "react-hot-toast";
import { validateIssueFields } from "./validateUpsertIssue";
import { IssueModalProps } from "@/interfaces/IssueModalProps";

const AddIssueModal: React.FC<IssueModalProps> = ({
  issueNumber,
  onResponse,
}) => {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const addIssue = async () => {
    if (!validateIssueFields(issueTitle, issueBody)) {
      return;
    }
    try {
      const octokit = new Octokit({
        auth: sessionStorage.getItem("fineGrainedAccessToken"),
      });
      const response = await octokit.request(
        `POST /repos/Shih-Yang-Young/issue-blog/issues`,
        {
          owner: "Shih-Yang-Young",
          repo: "issue-blog",
          title: issueTitle,
          body: issueBody,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      toast.success("add issue success!", {
        style: { background: "green", color: "white" },
        position: "top-center",
      });
      onResponse();
      onClose();
    } catch (error: any) {
      let msg = "";
      if (error.response.status === 404) {
        msg = "need fine grained access token to add issue";
      }
      toast.error("add issue error " + msg, {
        style: { background: "red", color: "white" },
        position: "top-center",
      });
    }
  };
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  return (
    <div>
      <Button onPress={onOpen} color="primary">
        Add Issue
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add New Issue
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="title"
                  placeholder="Enter your title"
                  variant="bordered"
                  required
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                />
                <Textarea
                  label="body"
                  placeholder="Enter your body"
                  variant="bordered"
                  size="lg"
                  value={issueBody}
                  onChange={(e) => setIssueBody(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={addIssue}>
                  Add New Issue
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddIssueModal;
