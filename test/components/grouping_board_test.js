import React from "react"
import sinon from "sinon"
import { shallow } from "enzyme"

import { dropTargetSpec, GroupingBoard } from "../../web/static/js/components/grouping_board"
import GroupingStageIdeaCard from "../../web/static/js/components/grouping_stage_idea_card"

describe("GroupingBoard", () => {
  const defaultProps = {
    ideas: [],
    actions: {},
  }

  context("when there are no ideas to render", () => {
    it("renders no idea cards", () => {
      const wrapper = shallow(
        <GroupingBoard {...defaultProps} ideas={[]} />
      )

      expect(wrapper.find(GroupingStageIdeaCard)).to.have.length(0)
    })
  })

  context("when there are ideas to render", () => {
    it("renders no idea cards", () => {
      const wrapper = shallow(
        <GroupingBoard {...defaultProps} ideas={[{ body: "hey", id: 5 }, { body: "hey", id: 6 }]} />
      )

      expect(wrapper.find(GroupingStageIdeaCard)).to.have.length(2)
    })
  })

  describe("dropTargetSpec", () => {
    describe("#drop", () => {
      let submitIdeaEditAsync

      beforeEach(() => {
        submitIdeaEditAsync = sinon.spy()

        const props = {
          actions: {
            submitIdeaEditAsync,
          },
        }

        const monitor = {
          getSourceClientOffset: () => ({ x: 78, y: 106 }),
          getItem: () => ({
            draggedIdea: {
              id: 54,
            },
          }),
        }

        dropTargetSpec.drop(props, monitor)
      })

      it("invokes the submitIdeaEditAsync action with attrs of the idea from the drag", () => {
        expect(submitIdeaEditAsync).to.have.been.calledWithMatch({
          id: 54,
        })
      })

      // the 1px increment helps account for border
      it("also includes the x/y client offsets from the drag, adding 1 to the x value", () => {
        expect(submitIdeaEditAsync).to.have.been.calledWithMatch({
          x: 79,
          y: 106,
        })
      })
    })
  })
})
