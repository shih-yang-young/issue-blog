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
  Tooltip,
} from "@nextui-org/react";
import { Octokit } from "octokit";
import { toast } from "react-hot-toast";
import { IssueModalProps } from "@/interfaces/IssueModalProps";
import { EditIcon } from "@/app/management/EditIcon";
import { validateIssueFields } from "./validateUpsertIssue";

const EditIssueModal: React.FC<IssueModalProps> = ({
  issueNumber,
  onResponse,
}) => {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueBody, setIssueBody] = useState("");
  const editIssue = async () => {
    if (!validateIssueFields(issueTitle, issueBody)) {
      return;
    }
    try {
      const octokit = new Octokit({
        auth: sessionStorage.getItem("fineGrainedAccessToken"),
      });
      const response = await octokit.request(
        `PATCH /repos/Shih-Yang-Young/issue-blog/issues/${issueNumber}`,
        {
          owner: "Shih-Yang-Young",
          repo: "issue-blog",
          issue_number: issueNumber,
          title: issueTitle,
          body: issueBody,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
      );
      toast.success("edit issue success!", {
        style: { background: "green", color: "white" },
        position: "top-center",
      });
      onClose();
      onResponse();
    } catch (error: any) {
      let msg = "";
      if (error.response.status === 401) {
        msg =
          "requires authentication. Need fine grained access token to add issue";
      } else if (error.response.status === 403) {
        msg =
          "must have admin rights to Repository. Need fine grained access token to add issue";
      }
      toast.error("delete issue error " + msg, {
        style: { background: "red", color: "white" },
        position: "top-center",
      });
    }
  };
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  return (
    <div>
      <Tooltip content="Edit Issue">
        <span
          className="text-lg text-default-400 cursor-pointer active:opacity-50"
          onClick={onOpen}
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Issue Number {issueNumber}
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
                <Button color="primary" onPress={editIssue}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default EditIssueModal;
