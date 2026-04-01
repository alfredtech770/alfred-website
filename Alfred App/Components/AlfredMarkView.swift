//
//  AlfredMarkView.swift
//  Alfred App
//
//  Alfred "A" logomark view.
//

import SwiftUI

struct AlfredMarkView: View {
    var size: CGFloat = 24
    var color: Color = A.s4

    var body: some View {
        Text("A")
            .font(.system(size: size, weight: .bold, design: .serif))
            .foregroundStyle(color)
    }
}
